import { useEffect } from 'react';

export const useProtecaoTela = () => {
  useEffect(() => {

    const handleKeyDown = (e: KeyboardEvent) => {
      const forbiddenKeys = ['u', 's', 'a', 'c', 'x'];
      if ((e.ctrlKey || e.metaKey) && forbiddenKeys.includes(e.key.toLowerCase())) {
        e.preventDefault();
        e.stopPropagation();
      }

      if (e.key === 'PrintScreen' || e.key === 'F12') {
        e.preventDefault();
        e.stopPropagation();
        showOverlay();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen') {
        navigator.clipboard.writeText('');
        showOverlay();
      }
    };

  
    const handleContextMenu = (e: MouseEvent) => e.preventDefault();

  
    const handleDragStart = (e: DragEvent) => e.preventDefault();


    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      alert('Cópia desabilitada!');
    };


    const overlay = document.createElement('div');
    overlay.id = 'anti-screenshot-overlay';
    Object.assign(overlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100vw',
      height: '100vh',
      zIndex: '99999',
      background: 'rgb(0, 0, 0)',
      color: '#fff',
      display: 'none',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
    });
    overlay.innerText = 'Captura de tela bloqueada!';
    document.body.appendChild(overlay);

    const showOverlay = () => {
      overlay.style.display = 'flex';
      setTimeout(() => {
        overlay.style.display = 'none';
      }, 2000);
    };

  
    const style = document.createElement('style');
    style.innerHTML = `
      * {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
      }
      ::selection {
        background: none;
      }
      @media print {
        body { display: none !important; }
      }
    `;
    document.head.appendChild(style);


    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('copy', handleCopy);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('copy', handleCopy);
      document.head.removeChild(style);
      document.body.removeChild(overlay);
    };
  }, []);
};
