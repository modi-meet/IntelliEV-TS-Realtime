import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

admin.initializeApp();

export const onSosAlertCreated = functions.firestore
  .document("sos_alerts/{id}")
  .onCreate((snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const data = snap.data();
    const docId = context.params.id;

    functions.logger.info(`New SOS Alert created: ${docId}`, {
      lat: data.lat,
      lng: data.lng,
      triggerMethod: data.triggerMethod,
      timestamp: data.timestamp,
    });

    return null;
  });

export const calculateSeverityOnSosCreate = functions.firestore
  .document("sos_alerts/{id}")
  .onCreate(async (snap: functions.firestore.QueryDocumentSnapshot, context: functions.EventContext) => {
    const data = snap.data() || {};
    const docId = context.params.id;

    // 1. Start with score = 0
    let score = 0;

    // Extract fields with defaults
    const vehicleData = data.vehicleData || {};
    const triggerMethod = data.triggerMethod || "Manual";

    // 2. Vehicle dynamics
    const gForce = Number(vehicleData.g_force) || 0;
    const airbagsDeployed = vehicleData.airbags_deployed === true;
    const deltaV = Number(vehicleData.delta_v) || 0;
    const rolloverDetected = vehicleData.rollover_detected === true;

    if (gForce >= 3.0) score += 25;
    if (airbagsDeployed) score += 30;
    if (deltaV >= 25) score += 20;
    if (rolloverDetected) score += 40;

    // 3. Trigger method
    if (triggerMethod === "Automatic") score += 10;
    else if (triggerMethod === "Manual") score += 5;
    else if (triggerMethod === "Simulation") score += 0;

    // 4. Clamp score between 0 and 100
    if (score > 100) score = 100;
    if (score < 0) score = 0;

    // 5. Severity level
    let level: "low" | "moderate" | "high" | "critical" = "low";
    if (score >= 80) level = "critical";
    else if (score >= 60) level = "high";
    else if (score >= 30) level = "moderate";
    else level = "low";

    // 6. Update document
    const severity = {
      score: score,
      level: level,
      computedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    functions.logger.info(`Calculated severity for ${docId}`, {
      score,
      level,
    });

    await snap.ref.update({ severity });
  });

// Helper: Haversine formula to calculate distance in km
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in km
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export const assignNearestResponderOnSeverityUpdate = functions.firestore
  .document("sos_alerts/{id}")
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();
    const docId = context.params.id;

    // 2. If before.severity is the same as after.severity, exit (no change).
    const beforeSeverity = before?.severity;
    const afterSeverity = after?.severity;

    if (JSON.stringify(beforeSeverity) === JSON.stringify(afterSeverity)) {
      return null;
    }

    // 3. If after.severity does NOT exist, exit.
    if (!afterSeverity) {
      return null;
    }

    // 4. If severity.level is NOT "high" or "critical", exit.
    const level = afterSeverity.level;
    if (level !== "high" && level !== "critical") {
      return null;
    }

    // 5. Extract SOS lat/lng
    const sosLat = after.lat;
    const sosLng = after.lng;

    if (typeof sosLat !== "number" || typeof sosLng !== "number") {
      functions.logger.warn(`SOS Alert ${docId} missing valid lat/lng`);
      return null;
    }

    // 6. Query responders
    const respondersSnapshot = await admin.firestore().collection("users")
      .where("userType", "==", "emergency")
      .where("status", "==", "available")
      .get();

    let nearestResponder: any = null;
    let minDistance = Infinity;

    // 7. For each responder
    respondersSnapshot.forEach(doc => {
      const data = doc.data();
      if (typeof data.lat === "number" && typeof data.lng === "number") {
        const distance = calculateDistance(sosLat, sosLng, data.lat, data.lng);
        if (distance < minDistance) {
          minDistance = distance;
          nearestResponder = { ...data, uid: doc.id };
        }
      }
    });

    // 8. If none found
    if (!nearestResponder) {
      functions.logger.info(`No available responders found for SOS ${docId}`);
      await change.after.ref.update({
        assignedResponder: null,
        status: "unassigned"
      });
      return null;
    }

    // 9. If nearest found
    functions.logger.info(`Assigning responder ${nearestResponder.uid} to SOS ${docId}`, {
      distance: minDistance,
      severity: level
    });

    const batch = admin.firestore().batch();

    // Update SOS doc
    batch.update(change.after.ref, {
      assignedResponder: {
        uid: nearestResponder.uid,
        name: nearestResponder.name || nearestResponder.username || "",
        distanceKm: minDistance
      },
      status: "assigned",
      assignedAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // Update responder doc
    const responderRef = admin.firestore().collection("users").doc(nearestResponder.uid);
    batch.update(responderRef, {
      status: "busy",
      currentTaskId: docId
    });

    await batch.commit();
    return null;
  });
