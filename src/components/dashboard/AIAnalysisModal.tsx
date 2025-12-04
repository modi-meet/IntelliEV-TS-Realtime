import React, { useState, useRef, useEffect, ChangeEvent } from 'react';
import * as cocoSsd from '@tensorflow-models/coco-ssd';
import '@tensorflow/tfjs';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReport: (data: any) => void;
}

const AIAnalysisModal = ({ isOpen, onClose, onReport }: AIAnalysisModalProps) => {
  const [model, setModel] = useState<cocoSsd.ObjectDetection | null>(null);
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<cocoSsd.DetectedObject[] | null>(null);
  const [severity, setSeverity] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await cocoSsd.load();
        setModel(loadedModel);
        console.log('COCO-SSD model loaded');
      } catch (err) {
        console.error('Failed to load model', err);
      }
    };
    if (isOpen && !model) {
      loadModel();
    }
  }, [isOpen, model]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setImage(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setResults(null);
      setSeverity(0);
    }
  };

  const calculateSeverity = (predictions: cocoSsd.DetectedObject[]) => {
    let score = 0;
    let vehicleCount = 0;
    let personDetected = false;

    const hazardObjects: Record<string, number> = {
      car: 3, truck: 5, bus: 6, motorcycle: 2, bicycle: 1,
      person: 10, ambulance: 8, police_car: 7, fire_truck: 8,
      'fire hydrant': 1, 'stop sign': 1, 'traffic light': 1,
    };

    predictions.forEach((p) => {
      if (hazardObjects[p.class]) {
        score += hazardObjects[p.class] * p.score;
        if (['car', 'truck', 'bus', 'motorcycle', 'ambulance'].includes(p.class)) {
          vehicleCount++;
        }
        if (p.class === 'person') personDetected = true;
      }
    });

    if (vehicleCount > 1) score += vehicleCount * 2;
    if (personDetected) score *= 1.5;

    return Math.min(Math.round(score), 10);
  };

  const drawDetections = (predictions: cocoSsd.DetectedObject[]) => {
    if (!canvasRef.current || !imageRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;
    
    const img = imageRef.current;
    canvasRef.current.width = img.width;
    canvasRef.current.height = img.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(img, 0, 0);

    predictions.forEach(prediction => {
      const [x, y, width, height] = prediction.bbox;
      ctx.strokeStyle = '#ff0000';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, width, height);
      
      ctx.fillStyle = '#ff0000';
      ctx.font = '16px Arial';
      ctx.fillText(
        `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
        x, y > 20 ? y - 5 : y + 20
      );
    });
  };

  const handleAnalyze = async () => {
    if (!model || !imageRef.current) return;
    setIsAnalyzing(true);

    try {
      const predictions = await model.detect(imageRef.current);
      setResults(predictions);

      const sev = calculateSeverity(predictions);
      setSeverity(sev);

      drawDetections(predictions);
    } catch (error) {
      console.error('Analysis failed', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSendReport = () => {
    if (results) {
      onReport({
        severity,
        detections: results,
        image: previewUrl
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className='fixed inset-0 bg-black/40 flex items-center justify-center z-[2000]'
      onClick={onClose}
    >
      <div 
        className='bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 max-h-[85vh] overflow-y-auto no-scrollbar'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='p-5'>
          <div className='flex justify-between items-center mb-4'>
            <h2 className='text-xl font-bold text-gray-800'>AI Accident Analysis</h2>
            <button onClick={onClose} className='text-gray-400 hover:text-gray-600'>
              <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>

        <div className='space-y-4'>
          <input 
            type='file' 
            accept='image/*' 
            onChange={handleImageChange}
            className='block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100'
          />

          {previewUrl && (
            <div className='relative border rounded-lg overflow-hidden bg-gray-100 min-h-[200px] flex items-center justify-center'>
               <img 
                 ref={imageRef}
                 src={previewUrl} 
                 alt='Preview' 
                 className="max-w-full max-h-[400px]"
               />
               <canvas 
                 ref={canvasRef}
                 className="absolute top-0 left-0 w-full h-full"
               />
            </div>
          )}

          {results && (
            <div className={`p-4 rounded-lg ${
              severity <= 3 ? 'bg-green-50 text-green-700 border border-green-200' :
              severity <= 6 ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
              'bg-red-50 text-red-700 border border-red-200'
            }`}>
              <h3 className='font-bold text-lg'>Severity Score: {severity}/10</h3>
              <p className='text-sm mt-1'>
                {severity <= 3 ? 'Low severity - Minor incident' : 
                 severity <= 6 ? 'Medium severity - Moderate incident' : 
                 'High severity - Major incident requiring immediate attention'}
              </p>
              <div className='mt-2 text-xs'>
                Detected: {results.map(r => r.class).join(', ')}
              </div>
            </div>
          )}

          <div className='flex gap-3 mt-4'>
            <button 
              onClick={handleAnalyze} 
              disabled={!previewUrl || isAnalyzing || !model}
              className='flex-1 py-2.5 rounded-lg text-white font-semibold bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors'
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Image'}
            </button>
            
            {results && (
              <button 
                onClick={handleSendReport}
                className={`flex-1 py-2.5 rounded-lg text-white font-semibold transition-colors ${
                  severity > 6 ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600'
                }`}
              >
                {severity > 6 ? 'Send SOS Alert' : 'Report Hazard'}
              </button>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysisModal;
