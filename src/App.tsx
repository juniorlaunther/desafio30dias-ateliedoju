import { ShoppingCart, Star, Play, ShieldCheck, ArrowRight, PenTool, X, ChevronLeft, ChevronRight, MessageCircle } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const names = [
      "Ana", "Paulo", "Maria", "João", "Pedro", "Lucas", "Julia", "Marcos", "Fernanda", "Gabriel", 
      "Luana", "Carlos", "Juliana", "Rafael", "Camila", "Rodrigo", "Amanda", "Diego", "Letícia", 
      "Bruno", "Carolina", "Thiago", "Beatriz", "Felipe", "Mariana", "Gustavo", "Renata", 
      "Leonardo", "Larissa", "Ricardo", "Vanessa", "Daniel", "Patricia"
    ];

    let timeoutId: NodeJS.Timeout;

    const showRandomNotification = () => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      setPurchaseNotification(`${randomName} comprou!!`);

      // Hide after 3 seconds
      setTimeout(() => {
        setPurchaseNotification(null);
        
        // Schedule next one between 5 to 15 seconds
        const nextDelay = Math.floor(Math.random() * 10000) + 5000;
        timeoutId = setTimeout(showRandomNotification, nextDelay);
      }, 3000);
    };

    // Initial trigger
    const initialDelay = Math.floor(Math.random() * 10000) + 5000;
    timeoutId = setTimeout(showRandomNotification, initialDelay);

    return () => clearTimeout(timeoutId);
  }, []);

  const handleScroll = () => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const containerCenter = container.scrollLeft + container.offsetWidth / 2;
      let closestIndex = 0;
      let minDistance = Infinity;

      Array.from(container.children).forEach((child, index) => {
        const childElement = child as HTMLElement;
        const childCenter = (childElement.offsetLeft - container.offsetLeft) + childElement.offsetWidth / 2;
        const distance = Math.abs(containerCenter - childCenter);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = index;
        }
      });

      setActiveIndex(closestIndex);
    }
  };

  const scrollToImage = (index: number) => {
    if (carouselRef.current) {
      const container = carouselRef.current;
      const child = container.children[index] as HTMLElement;
      if (child) {
        const targetScrollLeft = (child.offsetLeft - container.offsetLeft) + child.offsetWidth / 2 - container.offsetWidth / 2;
        container.scrollTo({
          left: targetScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  };

  const productImages = [
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgNUmpOBb0B29fWw4IU8SgZa4vLIItWwQH6R9E30CwZ-KoiktjXFcX79B4dwAFuIa6qiLbBHMGd4JVG1222AAkH0_FAyawVBEN1A605R4B6sANQCKPFVwQbFJNrgo6fla243mizytJYjH-qj5SlCaAiajVdVz3mK7hyZOCTXIh_z8SCRddV3HZ0oDg94Mw/w480-h640/desenhando.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiQF9XJ454wd0uourww-UuQA8qBjT3kwTWnKZ-Szy6-5uBvjNBmfxxrSreMNV4Z5JXYfE6MeGcGjrSPpF66QY3SzUjfvHv1xYCFjKBFTXw9ubraSJwmqDHbAGPTtgq1SF7Z9FKFYwPcd-IajEpNhLCXc3BGYQks0-Ht8wkBGcZJQASf7boXPROhNU2Tj38/w480-h640/desenhando2.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgyvPpYrC2WGFPG4Qi78ErtqfB-r57pH-mph_yvhTQSDEhKl8m6b-L-PRI9Gd5M2vzTdlj8Q8QQVCuJk0nW23B1NY_y6U9wU6QYWm-wcw_RPIvN5kU1rqYGpnBV-MzAV3LICMuV4tXrA79g1QucyzG5TAT4QcZd27Hwe-7rIA28Tl4b_sxZq9sbFxoDZ-A/w480-h640/pagina%20close.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhd0OcjWHbpcgEScV8vZ0dOfFQZklUuToa9RS2WqRsd8aFT3Ku4Kfz9Y5_XLL_XGz4AGA-Y0xbl4phh3qUemXUDJ4BeRiwEaFtSvA9DGfR3ng9HjhHxXz3idlATwcWbxR43giHi3XbBD4zyf_-ZEFiOd59AUsi7Ij_qYBZn8e8eUXdNB5-eklyHRL2csZk/w480-h640/desafio%2030%20dias%20tabela.png",
  ];

  const paginate = (newDirection: number) => {
    if (lightboxIndex !== null) {
      setDirection(newDirection);
      setLightboxIndex((prev) => {
        if (prev === null) return 0;
        let next = prev + newDirection;
        if (next < 0) next = productImages.length - 1;
        if (next >= productImages.length) next = 0;
        return next;
      });
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxIndex(null);
      if (e.key === 'ArrowRight') paginate(1);
      if (e.key === 'ArrowLeft') paginate(-1);
    };
    if (lightboxIndex !== null) {
      window.addEventListener('keydown', handleKeyDown);
      // Prevent scrolling when lightbox is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [lightboxIndex]);

  return (
    <div className="min-h-screen pb-20 selection:bg-[#436CC0] selection:text-white overflow-x-hidden">
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm"
          >
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 z-50 p-2 bg-white rounded-full border-2 border-[#2c2c2c] shadow-[2px_2px_0px_0px_#2c2c2c] hover:bg-gray-100 transition-colors"
            >
              <X className="w-8 h-8 text-[#2c2c2c]" />
            </button>

            <button
              className="absolute left-4 md:left-8 z-50 p-3 bg-white rounded-full border-2 border-[#2c2c2c] shadow-[2px_2px_0px_0px_#2c2c2c] hover:bg-gray-100 transition-colors hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                paginate(-1);
              }}
            >
              <ChevronLeft className="w-8 h-8 text-[#2c2c2c]" />
            </button>

            <div className="relative w-full h-full flex items-center justify-center overflow-hidden pointer-events-none">
              <AnimatePresence initial={false} custom={direction}>
                <motion.img
                  key={lightboxIndex}
                  src={productImages[lightboxIndex]}
                  custom={direction}
                  variants={{
                    enter: (direction: number) => ({
                      x: direction > 0 ? 1000 : -1000,
                      opacity: 0
                    }),
                    center: {
                      zIndex: 1,
                      x: 0,
                      opacity: 1
                    },
                    exit: (direction: number) => ({
                      zIndex: 0,
                      x: direction < 0 ? 1000 : -1000,
                      opacity: 0
                    })
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 }
                  }}
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={(e, { offset, velocity }) => {
                    const swipe = swipePower(offset.x, velocity.x);
                    if (swipe < -swipeConfidenceThreshold) {
                      paginate(1);
                    } else if (swipe > swipeConfidenceThreshold) {
                      paginate(-1);
                    }
                  }}
                  className="absolute max-h-[65vh] md:max-h-[85vh] max-w-[85vw] md:max-w-[75vw] object-contain rounded-xl border-4 border-[#2c2c2c] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.1)] cursor-grab active:cursor-grabbing pointer-events-auto"
                />
              </AnimatePresence>
            </div>

            <button
              className="absolute right-4 md:right-8 z-50 p-3 bg-white rounded-full border-2 border-[#2c2c2c] shadow-[2px_2px_0px_0px_#2c2c2c] hover:bg-gray-100 transition-colors hidden md:block"
              onClick={(e) => {
                e.stopPropagation();
                paginate(1);
              }}
            >
              <ChevronRight className="w-8 h-8 text-[#2c2c2c]" />
            </button>

            {/* Mobile Navigation Arrows */}
            <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 md:hidden z-50">
              <button
                className="p-3 bg-white rounded-full border-2 border-[#2c2c2c] shadow-[2px_2px_0px_0px_#2c2c2c] active:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(-1);
                }}
              >
                <ChevronLeft className="w-8 h-8 text-[#2c2c2c]" />
              </button>
              <button
                className="p-3 bg-white rounded-full border-2 border-[#2c2c2c] shadow-[2px_2px_0px_0px_#2c2c2c] active:bg-gray-100"
                onClick={(e) => {
                  e.stopPropagation();
                  paginate(1);
                }}
              >
                <ChevronRight className="w-8 h-8 text-[#2c2c2c]" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Logo */}
      <header className="pt-6 pb-4 px-4 flex justify-center items-center">
        <img 
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhpE_EGskDV5xF-Zatju1s5YXCEwdvpoGvreUeDwvnsm4r6r3iCJLuvdEyMYGOmFw3lSUVTmCyF__bUxErisaS4CFA8c0v3aVpiiFIwd7H4-kZKyAFCXPl6LXKtle431_Dhcvmgb_YPD8OT_tXW2ya0MrYP8ZyV11lFaDWHAcuto0A6pyncxmhzsUsoZA/w640-h208/titulo%20desafio%2030%20dias%20desenhando.png" 
          alt="Desafio 30 Dias Desenhando" 
          className="max-h-28 md:max-h-40 object-contain drop-shadow-md animate-scale-soft"
        />
      </header>

      <main className="max-w-4xl mx-auto px-4 md:px-8">
        
        {/* Product Carousel */}
        <div className="relative mb-12 w-full max-w-4xl mx-auto">
           <div 
             ref={carouselRef}
             onScroll={handleScroll}
             className="flex md:grid md:grid-cols-2 lg:grid-cols-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory gap-4 md:gap-6 py-4 md:py-6 no-scrollbar px-2 scroll-smooth"
           >
              {productImages.map((url, i) => (
               <div key={i} className="w-[85vw] max-w-[280px] md:w-full md:max-w-none shrink-0 snap-center mx-auto flex justify-center relative hover:z-10">
                  <div 
                    className={`bg-white p-2 md:p-3 border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#436CC0] rounded-xl w-full transition-transform duration-300 hover:scale-105 cursor-pointer ${i % 2 === 0 ? 'rotate-1 hover:rotate-2' : '-rotate-1 hover:-rotate-2'}`}
                    onClick={() => setLightboxIndex(i)}
                  >
                    <img 
                      src={url} 
                      alt={`Preview do produto ${i + 1}`} 
                      className="w-full aspect-[3/4] object-cover rounded-lg border-2 border-dashed border-gray-300 pointer-events-none" 
                    />
                  </div>
               </div>
             ))}
           </div>
           <div className="flex md:hidden items-center justify-center gap-2 mt-1 text-gray-500 text-sm">
             <span className="animate-pulse">👈</span> Deslize para ver mais <span className="animate-pulse">👉</span>
           </div>
           <div className="flex md:hidden justify-center gap-3 mt-2">
             {productImages.map((_, i) => (
               <button 
                 key={i} 
                 onClick={() => scrollToImage(i)}
                 aria-label={`Ver imagem ${i + 1}`}
                 className={`w-3 h-3 rounded-full border-2 border-[#2c2c2c] cursor-pointer transition-colors ${activeIndex === i ? 'bg-[#436CC0]' : 'bg-transparent'}`}
               />
             ))}
           </div>
        </div>

        {/* Short Description & Buy Section */}
        <section className="mb-10 bg-[#F4E285] p-5 md:p-8 rounded-3xl border-4 border-[#2c2c2c] shadow-[6px_6px_0px_0px_#2c2c2c] -rotate-1 relative z-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-center gap-1 mb-3 text-[#436CC0]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="fill-current w-5 h-5 md:w-6 md:h-6 animate-scale-pulse" style={{ animationDelay: `${i * 100}ms` }} />
            ))}
          </div>
          
          <h1 className="text-2xl md:text-4xl font-bold mb-3 leading-tight text-center md:text-left">
            30 Dias para Criar Constância e Não Abandonar o Desenho
          </h1>
          
          <p className="text-lg md:text-xl mb-6 opacity-90 text-center md:text-left">
            Um desafio simples para você desenhar um pouco todos os dias, acompanhar seu progresso e chegar ao final com 30 desenhos concluídos.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white/50 p-4 rounded-2xl border-2 border-[#2c2c2c] border-dashed">
            <div className="flex flex-col items-center md:items-start shrink-0">
               <span className="line-through text-gray-500 text-[19px] font-bold">De R$ 49,00</span>
               <span className="text-[30px] font-bold text-[#436CC0] drop-shadow-sm">Por R$ 17,90</span>
            </div>
            
            <a href="https://pay.hotmart.com/I106894004O?off=ymm60njl&checkoutMode=10" target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-[#436CC0] hover:bg-[#325296] text-white text-lg md:text-xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2 md:gap-3 animate-shine">
              <ShoppingCart className="w-6 h-6 shrink-0 animate-wiggle" />
              <span className="text-center leading-tight whitespace-nowrap">QUERO COMEÇAR O DESAFIO</span>
            </a>
          </div>
        </section>

        {/* Long Description */}
        <section className="mb-10 space-y-8 max-w-3xl mx-auto">
          <div className="bg-white p-5 md:p-8 rounded-3xl border-4 border-[#2c2c2c] shadow-[6px_6px_0px_0px_#F0B7B7] rotate-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-5 flex items-center gap-3">
              <span className="bg-[#F0B7B7] p-2 rounded-xl border-4 border-[#2c2c2c] shadow-[2px_2px_0px_0px_#2c2c2c] animate-wiggle inline-block">🤔</span> 
              Para quem é este desafio?
            </h2>
            <ul className="space-y-4 text-lg md:text-xl">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '0ms' }} />
                <span>Para quem sempre começa a desenhar, mas abandona a prática depois de alguns dias.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '100ms' }} />
                <span>Para quem quer criar constância sem depender da inspiração aparecer.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '200ms' }} />
                <span>Para quem tem pouco tempo e procura uma atividade criativa para incluir na rotina.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '300ms' }} />
                <span>Para quem fica sem saber o que desenhar e precisa de uma missão para começar.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '400ms' }} />
                <span>Para quem quer acompanhar sua evolução e sentir a satisfação de completar os 30 dias.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F4EDE3] p-5 md:p-8 rounded-3xl border-4 border-[#2c2c2c] border-dashed shadow-[6px_6px_0px_0px_#436CC0] -rotate-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-5 flex items-center gap-3">
              <PenTool className="w-8 h-8 text-[#436CC0] animate-wiggle" />
              O que você vai receber?
            </h2>
            <p className="text-lg md:text-xl mb-5">
              Aqui, o objetivo não é fazer desenhos perfeitos. A proposta é assumir um pequeno compromisso diário, cumprir cada missão e registrar seu progresso até completar o desafio.
            </p>
            <ul className="space-y-4 text-lg md:text-xl mb-4">
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#F4E285] border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '0ms' }}>1</span>
                <span>Um painel com 30 espaços numerados para registrar um desenho por dia.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#F0B7B7] border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '200ms' }}>2</span>
                <span>Uma lista com 30 sugestões criativas para usar sempre que você não souber o que desenhar.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#436CC0] text-white border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '400ms' }}>3</span>
                <span>Um material prático e visual para desacelerar e exercitar a criatividade por alguns minutos todos os dias.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Video Placeholder */}
        <section className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#2c2c2c]">Conheça o seu novo desafio!</h2>
          <div className="relative bg-white border-4 border-[#2c2c2c] rounded-3xl p-3 shadow-[8px_8px_0px_0px_#F0B7B7] rotate-1 max-w-sm mx-auto">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhd0OcjWHbpcgEScV8vZ0dOfFQZklUuToa9RS2WqRsd8aFT3Ku4Kfz9Y5_XLL_XGz4AGA-Y0xbl4phh3qUemXUDJ4BeRiwEaFtSvA9DGfR3ng9HjhHxXz3idlATwcWbxR43giHi3XbBD4zyf_-ZEFiOd59AUsi7Ij_qYBZn8e8eUXdNB5-eklyHRL2csZk/w480-h640/desafio%2030%20dias%20tabela.png" 
              alt="Desafio por dentro" 
              className="w-full aspect-[3/4] object-cover border-4 border-dashed border-[#2c2c2c] rounded-2xl" 
            />
            
            {/* Sketchy decorations */}
            <div className="absolute -top-6 -right-6 text-4xl animate-bounce">✨</div>
            <div className="absolute -bottom-6 -left-6 text-4xl animate-wiggle inline-block">🎨</div>
          </div>
        </section>

        <div className="flex justify-center mb-14 px-2">
          <a href="https://pay.hotmart.com/I106894004O?off=ymm60njl&checkoutMode=10" target="_blank" rel="noopener noreferrer" className="w-full max-w-sm bg-[#436CC0] hover:bg-[#325296] text-white text-xl md:text-2xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2 animate-shine">
            <ShoppingCart className="w-6 h-6 shrink-0 animate-wiggle" />
            <span className="text-center leading-tight whitespace-nowrap">QUERO COMPRAR!</span>
          </a>
        </div>

        {/* Guarantee */}
        <section className="mb-10">
           <div className="bg-[#436CC0] text-white p-6 md:p-10 rounded-[2rem] border-4 border-[#2c2c2c] shadow-[8px_8px_0px_0px_#2c2c2c] flex flex-col md:flex-row items-center gap-6 md:gap-10 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-48 h-48 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
             <ShieldCheck className="w-20 h-20 md:w-24 md:h-24 shrink-0 relative z-10 animate-scale-pulse" />
             <div className="relative z-10 text-center md:text-left">
               <h3 className="text-2xl md:text-3xl font-bold mb-3">Garantia de 7 Dias</h3>
               <p className="text-lg md:text-xl opacity-90 leading-relaxed">
                 Comece o desafio com tranquilidade. Caso não fique satisfeito, basta solicitar o reembolso e receber 100% do valor investido.
               </p>
             </div>
           </div>
        </section>

        {/* WhatsApp CTA */}
        <section className="mb-14 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Ainda tem dúvidas?</h3>
          <div className="flex justify-center px-2">
            <a href="https://wa.me/5519988508110?text=Oi%2C%20vim%20do%20site%20do%20manual.%20Tenho%20uma%20d%C3%BAvida." target="_blank" rel="noopener noreferrer" className="w-full max-w-sm bg-[#25D366] hover:bg-[#1DA851] text-white text-xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2">
               <MessageCircle className="w-6 h-6 shrink-0 animate-wiggle" />
               <span className="text-center leading-tight whitespace-nowrap">Falar no WhatsApp</span>
            </a>
          </div>
        </section>

      </main>

      <footer className="text-center py-8 text-gray-500 text-sm max-w-4xl mx-auto px-4 relative">
        <div className="absolute top-0 left-1/4 right-1/4 h-1 border-t-2 border-dashed border-[#2c2c2c] opacity-20"></div>

        <div className="flex justify-center mb-6 mt-8">
          <img 
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjhpE_EGskDV5xF-Zatju1s5YXCEwdvpoGvreUeDwvnsm4r6r3iCJLuvdEyMYGOmFw3lSUVTmCyF__bUxErisaS4CFA8c0v3aVpiiFIwd7H4-kZKyAFCXPl6LXKtle431_Dhcvmgb_YPD8OT_tXW2ya0MrYP8ZyV11lFaDWHAcuto0A6pyncxmhzsUsoZA/w640-h208/titulo%20desafio%2030%20dias%20desenhando.png" 
            alt="Desafio 30 Dias Desenhando" 
            className="h-16 md:h-20 object-contain drop-shadow-sm opacity-80 hover:opacity-100 transition-opacity"
          />
        </div>

        <p className="mt-4">© {new Date().getFullYear()} Desafio 30 Dias Desenhando.</p>
        <p>Todos os direitos reservados.</p>
      </footer>

      {/* Fake Purchase Notification */}
      <AnimatePresence>
        {purchaseNotification && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 left-6 z-50 bg-[#4CAF50] text-white px-5 py-3 rounded-2xl border-2 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] flex items-center gap-3 font-bold text-sm md:text-base pointer-events-none"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            {purchaseNotification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
