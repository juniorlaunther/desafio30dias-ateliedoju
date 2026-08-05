import { ShoppingCart, Star, Play, ShieldCheck, ArrowRight, PenTool, X, ChevronLeft, ChevronRight, MessageCircle, ChevronDown } from 'lucide-react';
import { useRef, useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const faqData = [
  {
    icon: "✏️",
    question: "Preciso saber desenhar para participar?",
    answer: "Não! O Desafio foi criado para incentivar a prática de forma leve e sem cobranças. Você não precisa ter experiência, dominar técnicas ou fazer desenhos perfeitos. Basta começar e criar do seu jeito."
  },
  {
    icon: "📖",
    question: "O que vou encontrar dentro do Desafio?",
    answer: "Você encontrará 30 ideias criativas de desenho, uma para cada dia, além de duas páginas, com 30 espaços totais, para os desenhos diários. O material também inclui um quadro para combinar personagem, objeto e lugar, criando novas possibilidades de desenho. Você pode escolher as combinações por conta própria ou deixar o destino decidir usando as tirinhas recortáveis."
  },
  {
    icon: "📅",
    question: "Preciso completar os 30 dias seguidos?",
    answer: "Não. Você pode fazer um desenho por dia ou realizar o Desafio no seu próprio ritmo. Caso precise fazer uma pausa, basta continuar de onde parou. O mais importante é criar, praticar e aproveitar o processo."
  },
  {
    icon: "🖨️",
    question: "Posso imprimir o material?",
    answer: "Sim! O material foi preparado em formato A4 para que você possa imprimir, acompanhar os dias concluídos, utilizar as tirinhas recortáveis e manter o Desafio sempre por perto durante a sua prática."
  },
  {
    icon: "📱",
    question: "Como funciona o acesso depois da compra?",
    answer: "Após a aprovação do pagamento, o acesso é liberado automaticamente. Você receberá as instruções no e-mail informado durante a compra e poderá acessar o Desafio sempre que quiser pela sua área de acesso."
  }
];

const checkoutBaseUrl = "https://pay.hotmart.com/I106894004O?off=ymm60njl&checkoutMode=10";

const allowedParams = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "utm_id",
  "sck"
];

export default function App() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(0);
  const [purchaseNotification, setPurchaseNotification] = useState<string | null>(null);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [checkoutUrl, setCheckoutUrl] = useState(checkoutBaseUrl);
  
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      let foundAny = false;
      const currentUrlParams: Record<string, string> = {};
      
      allowedParams.forEach(param => {
        const value = urlParams.get(param);
        if (value) {
          currentUrlParams[param] = value;
          foundAny = true;
        }
      });

      let activeParams = currentUrlParams;
      if (foundAny) {
        sessionStorage.setItem('desafio30_utm_params', JSON.stringify(currentUrlParams));
      } else {
        const stored = sessionStorage.getItem('desafio30_utm_params');
        if (stored) {
          activeParams = JSON.parse(stored);
        }
      }

      const finalUrl = new URL(checkoutBaseUrl);
      Object.keys(activeParams).forEach(key => {
        if (activeParams[key]) {
          finalUrl.searchParams.set(key, activeParams[key]);
        }
      });
      
      setCheckoutUrl(finalUrl.toString());
    } catch (e) {
      console.error("Error setting up checkout URL", e);
    }
  }, []);

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
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjj7ApXwM9UeYxhvGO7VsWYWPvGlXsraQvCJzYFaLNwWlVoVu5eA6UAKuvSkqO3G7wlcaGnQfcraJq1dXwW0Ml55ctUqaLE9oazr859JoP081unreL7ukkUac629AacRpQUtMKhKmB4ORTK6E8a2sA7AGelgo4OrtmgGkyTEZrmsjClzoGKmfsVQYa5KL0/w480-h640/imagem%202.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg1kewVte95VLwZpt2mctabiSvHEyyf7zWyOopa1_lpofHghVhepUfidU6xNQl-ubjHDOt3rU6XT6b3oHXtoCFgSOyLNf008HxnNcX3TFiv0EDRPFN_zpp65HPvoE0CgrSyi12UJgpdYUZIUhZTiaAn5rOKkW0HT9Scnbyt4xp05qnpqSTSCRDEvz9R8II/w480-h640/imagem%201.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhPx4m9zxsHsVym0bCW1e4UCjSxzkh8cgeZ6dhQSNGJgoYNbHzjRY-1urmJUipQZOVG-ThlhayQql_WA3XwyPadOC2sC2cKFfM3hAF7T38aiBCzeHo8t8vPuXzPVYPAcYGtP8TTrFOIId_Djl9AuYuY_l5JvgwHh2cahqSqQrEoahe9kWUz31X5pjFKMvs/w480-h640/imagem%204.png",
    "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiZuDw7MRu_PUQoJFqqaYO3mrqadTgl5FRfomQpb7zuLa1RShzztm2eHVF3dAPDQwQTqLcBNB9F5ffajy6wB11xLN-yvGJuamk6YN6EBaMa3If_4xBp4a2yaXTs45AFNk0XOk8wLK-VC3z6f6h9yw-E67S9m4bRV1HTVDnwnmwHDfsBhXeHkpFihsDzqtU/w480-h640/imagem%203.png",
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
          src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhT0DaThee0JjktClFBu6gyTOwA9kPpZKpyaYaOX3Cy_aZrQgctBcS3kgLHQYGV9XyhfKfKy6o-cfbBWKhXtc8076E50CYd-GumZAzd4BATIdOQjWz2WhETSUD1b1GSWHeFV-lGKH-05OpDn51ttmAURZsE1KhIuNEaSl7Ow_mPUvpEzC3yazIPomUOsFw/w640-h246/logo%20completa%20desafio.png" 
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
            30 Dias para Destravar a Criatividade e Criar o Hábito de Desenhar
          </h1>
          
          <p className="text-lg md:text-xl mb-2 opacity-90 text-center md:text-left">
            Um desafio leve e imprimível, com ideias, combinações e sorteios para ajudar você a fazer um desenho por dia e chegar ao final com 30 criações feitas por você.
          </p>
          
          <p className="text-lg md:text-xl font-bold mb-6 text-center md:text-left">
            Não precisa ser perfeito. Só precisa existir. 💜
          </p>

          <div className="flex flex-col md:flex-row items-center justify-between gap-5 bg-white/50 p-4 rounded-2xl border-2 border-[#2c2c2c] border-dashed">
            <div className="flex flex-col items-center md:items-start shrink-0">
               <span className="line-through text-gray-500 text-[19px] font-bold">De R$ 49,00</span>
               <span className="text-[30px] font-bold text-[#436CC0] drop-shadow-sm">Por R$ 17,90</span>
            </div>
            
            <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="w-full md:w-auto bg-[#436CC0] hover:bg-[#325296] text-white text-lg md:text-xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2 md:gap-3 animate-shine">
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
                <span>Para quem gosta de desenhar, mas tem dificuldade de manter uma rotina.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '100ms' }} />
                <span>Para quem nunca sabe o que desenhar e precisa de ideias para começar.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '200ms' }} />
                <span>Para quem quer perder o medo da folha em branco e criar sem cobrança por perfeição.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '300ms' }} />
                <span>Para quem procura uma atividade criativa e leve para incluir no dia a dia.</span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-6 h-6 text-[#436CC0] shrink-0 mt-1 animate-slide-x" style={{ animationDelay: '400ms' }} />
                <span>Para quem conduz aulas, oficinas ou encontros criativos e busca uma proposta diferente para alunos ou grupos.</span>
              </li>
            </ul>
          </div>

          <div className="bg-[#F4EDE3] p-5 md:p-8 rounded-3xl border-4 border-[#2c2c2c] border-dashed shadow-[6px_6px_0px_0px_#436CC0] -rotate-1">
            <h2 className="text-2xl md:text-3xl font-bold mb-5 flex items-center gap-3">
              <PenTool className="w-8 h-8 text-[#436CC0] animate-wiggle" />
              O que você vai receber?
            </h2>
            <p className="text-lg md:text-xl mb-5">
              Um material 100% autoral e pronto para imprimir, criado para ajudar você a desenhar um pouco todos os dias durante 30 dias. Escolha uma proposta, faça o desenho do dia e preencha o seu espaço. Não precisa ser perfeito. Só precisa existir.
            </p>
            <ul className="space-y-4 text-lg md:text-xl mb-4">
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#F4E285] border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '0ms' }}>1</span>
                <span>Duas páginas com 30 espaços numerados, um para cada dia do desafio, para registrar e guardar todos os seus desenhos.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#F0B7B7] border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '200ms' }}>2</span>
                <span>Uma lista com 30 ideias criativas, uma para cada dia, para você nunca mais ficar sem saber o que desenhar.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#436CC0] text-white border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '400ms' }}>3</span>
                <span>O quadro Combine & Crie, no qual você pode misturar personagens, objetos e lugares para criar até 1.000 combinações diferentes.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-8 h-8 shrink-0 flex items-center justify-center bg-[#F4E285] border-2 border-[#2c2c2c] rounded-full font-bold text-base shadow-[2px_2px_0px_0px_#2c2c2c] animate-float" style={{ animationDelay: '600ms' }}>4</span>
                <span>30 tirinhas recortáveis para imprimir, sortear e deixar o tema do desenho do dia nas mãos do acaso, com um arquivo separado para impressão do verso.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* Video Placeholder */}
        <section className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center text-[#2c2c2c]">Conheça o seu novo desafio!</h2>
          <div className="relative bg-white border-4 border-[#2c2c2c] rounded-3xl p-3 shadow-[8px_8px_0px_0px_#F0B7B7] rotate-1 max-w-sm mx-auto">
            <img 
              src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgp4a_ev2poA9joPlT9WEokP8Pm6F_yUwr6INXmyCK8m-LW73QjAsdKKbsRTGakgTae5WX8HYTxAGBFm7y-997ziagHrq9z27sy0ToxEbr9LOr3-ilJ5V4CT1_s0Jlg41M0Qjlrvk8kwKz6UEGbfM_Q9FaKeC-kR6rVxGe1m8NLk2K8r8ksg8sdnKIMGI8/w300-h400/V%C3%ADdeocapcut%20comprimido.gif" 
              alt="Desafio por dentro" 
              className="w-full aspect-[3/4] object-cover border-4 border-dashed border-[#2c2c2c] rounded-2xl" 
            />
            
            {/* Sketchy decorations */}
            <div className="absolute -top-6 -right-6 text-4xl animate-bounce">✨</div>
            <div className="absolute -bottom-6 -left-6 text-4xl animate-wiggle inline-block">🎨</div>
          </div>
        </section>

        <div className="flex justify-center mb-14 px-2">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="w-full max-w-sm bg-[#436CC0] hover:bg-[#325296] text-white text-xl md:text-2xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2 animate-shine">
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
                 Comece o desafio com tranquilidade. Caso não fique satisfeito, basta solicitar o reembolso dentro desse período.
               </p>
             </div>
           </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-14">
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center text-[#2c2c2c]">Perguntas Frequentes</h2>
          <div className="space-y-4 max-w-3xl mx-auto">
            {faqData.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div key={index} className="bg-white border-4 border-[#2c2c2c] rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_#2c2c2c] transition-all">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full flex flex-row items-center justify-between p-5 md:p-6 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-2xl md:text-3xl animate-wiggle inline-block">{faq.icon}</span>
                      <h3 className="text-xl md:text-2xl font-bold text-[#2c2c2c] pr-4">{faq.question}</h3>
                    </div>
                    <ChevronDown className={`w-8 h-8 shrink-0 text-[#436CC0] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="p-5 md:p-6 pt-0 text-lg md:text-xl text-gray-700 leading-relaxed border-t-2 border-dashed border-gray-200 mt-2">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </section>

        <div className="flex justify-center mb-14 px-2">
          <a href={checkoutUrl} target="_blank" rel="noopener noreferrer" className="w-full max-w-sm bg-[#436CC0] hover:bg-[#325296] text-white text-xl md:text-2xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2 animate-shine">
            <ShoppingCart className="w-6 h-6 shrink-0 animate-wiggle" />
            <span className="text-center leading-tight whitespace-nowrap">ACEITO O DESAFIO!</span>
          </a>
        </div>

        {/* WhatsApp CTA */}
        <section className="mb-14 text-center">
          <h3 className="text-2xl md:text-3xl font-bold mb-6">Ainda tem dúvidas?</h3>
          <div className="flex justify-center px-2">
            <a href="https://wa.me/5519988508110?text=Oi%2C%20vim%20do%20site.%20Tenho%20uma%20d%C3%BAvida" target="_blank" rel="noopener noreferrer" className="w-full max-w-sm bg-[#25D366] hover:bg-[#1DA851] text-white text-xl font-bold py-3 md:py-4 px-4 md:px-8 rounded-2xl border-4 border-[#2c2c2c] shadow-[4px_4px_0px_0px_#2c2c2c] hover:translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px_#2c2c2c] transition-all flex items-center justify-center gap-2">
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
            src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhT0DaThee0JjktClFBu6gyTOwA9kPpZKpyaYaOX3Cy_aZrQgctBcS3kgLHQYGV9XyhfKfKy6o-cfbBWKhXtc8076E50CYd-GumZAzd4BATIdOQjWz2WhETSUD1b1GSWHeFV-lGKH-05OpDn51ttmAURZsE1KhIuNEaSl7Ow_mPUvpEzC3yazIPomUOsFw/w640-h246/logo%20completa%20desafio.png" 
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
