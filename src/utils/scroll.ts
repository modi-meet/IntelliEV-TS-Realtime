export const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
  e.preventDefault();
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
    
    // Add highlight animation
    element.classList.add('target-highlight');
    setTimeout(() => {
      element.classList.remove('target-highlight');
    }, 2000);
  }
};
