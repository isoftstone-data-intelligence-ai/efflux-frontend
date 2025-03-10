import React, { useEffect, useState } from 'react';
import './index.css';

// Guide steps configuration
const GUIDE_STEPS = [
  {
    id: 'welcome',
    target: null,
    title: '',
    content: ``,
    position: 'center',
    buttons: ['Skip', 'Start']
  },
  {
    id: 'Step1',
    target: '#languageModel',
    title: 'Choose Your Model',
    content: `Click to select your preferred AI model.`,
    position: 'top',
    buttons: ['Next']
  },
  {
    id: 'Step2',
    target: '#llm-settings',
    title: 'Configure Model Settings',
    content: 'Input your API key and endpoint.',
    position: 'top',
    buttons: ['Next']
  },
  {
    id: 'Step3',
    target: '#auto',
    title: 'Give your AI assistant a specific personality',
    content: `Select a persona to enhance your experience, or skip to use the default (auto).`,
    position: 'top',
    buttons: ['Next']
  },
  {
    id: 'Step4',
    target: 'button[title="Login Page"]',
    title: 'Jump-start with a curated collection of templates.',
    content: `Click a button to start the Text-to-UI or Screen-to-UI chat.`,
    position: 'top',
    buttons: ['Next']
  },
  {
    id: 'Step5',
    target: '#MCP',
    title: 'Switch to MCP',
    content: '',
    position: 'top',
    buttons: ['Next']
  },
  {
    id: 'Step6',
    target: '#server_name',
    title: 'Chat with data sources or tools',
    content: 'Click to select your preferred MCP Server',
    position: 'top',
    buttons: ['Next']
  },
  {
    id: 'Step7',
    target: 'img[alt="Servers SettingsLLM"]',
    title: 'Add More MCP Servers',
    content: `Explore more servers through MCP Hub.`,
    position: 'top',
    buttons: ['OK']
  }
] as const;

interface GuideTooltipProps {
  step: {
    id: string;
    target: string | null;
    content: string;
    position: 'top' | 'bottom' | 'left' | 'right' | 'center';
    buttons: string[];
  };
  onNext: () => void;
  onSkip: () => void;
  style: React.CSSProperties;
  currentStepIndex: number;
}

function GuideTooltip({ step, onNext, onSkip, style, currentStepIndex }: GuideTooltipProps) {
  const isDarkTheme = document.documentElement.classList.contains('dark');
  const stepNumber = currentStepIndex + 1;

  const handleButtonClick = (buttonText: string) => {
    if (buttonText === 'Skip') {
      onSkip();
    } else {
      onNext();
    }
  };

  // 对按钮进行排序，确保 Skip 在左，Start 在右
  const sortedButtons = step.id === 'welcome' ? ['Skip', 'Start'] : step.buttons;

  return (
    <>
      <div className="guide-overlay" />
      <div 
        className={`guide-tooltip ${isDarkTheme ? 'dark' : 'light'}`} 
        data-position={step.position} 
        style={{
          ...style,
          ...(step.position === 'center' && {
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)'
          })
        }}
      >
        {step.id!== 'welcome' && <div className="guide-tooltip-arrow" data-position={step.position} />}
        <div className="guide-tooltip-content">
          {step.id === 'welcome' 
            ?  <div className='welcome-text'><h2 className='title'>Welcome to the Efflux app!</h2>Let's start with a quick product tour.</div>
            : <div className='welcome-text'><h2 className='title'>{step.id}: {step.title}</h2>{step.content}</div>
          }
        </div>
        <div className="guide-tooltip-buttons">
          {sortedButtons.map((buttonText, index) => (
            <button 
              key={index}
              className={`guide-tooltip-button guide-tooltip-${buttonText.toLowerCase()}`} 
              onClick={() => handleButtonClick(buttonText)}
            >
              {buttonText}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default function UserGuide({ onStepChange }: { onStepChange: (step: number) => void }) {
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [showGuide, setShowGuide] = useState(true);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  // 新增状态，用于控制引导的显示延迟
  const [showDelayedGuide, setShowDelayedGuide] = useState(false); 

  useEffect(() => {
    const hasSeenGuide = localStorage.getItem('hasSeenGuide');
    if (hasSeenGuide) {
      setShowGuide(false);
    }
    // 延迟500ms后显示引导
    const timer = setTimeout(() => {
      setShowDelayedGuide(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (showGuide && GUIDE_STEPS[currentGuideStep]) {
      const targetElement = GUIDE_STEPS[currentGuideStep].target 
        ? document.querySelector(GUIDE_STEPS[currentGuideStep].target) 
        : null;
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const scrollTop = window.scrollY;
        const scrollLeft = window.scrollX;
        let top, left;
  
        // 获取引导框元素，用于动态计算偏移量
        const tooltipElement = document.querySelector('.guide-tooltip');
        const tooltipWidth = tooltipElement ? tooltipElement.offsetWidth : 300; // 默认宽度为 300
        const tooltipHeight = tooltipElement ? tooltipElement.offsetHeight : 100; // 默认高度为 100
  
        switch (GUIDE_STEPS[currentGuideStep].position) {
          case 'top':
            // 上移 2px
            top = rect.top + scrollTop - tooltipHeight - 5; 
            left = rect.left + scrollLeft + (rect.width / 2) - (tooltipWidth / 2); 
            break;
          case 'bottom':
            // 上移 2px
            top = rect.bottom + scrollTop - 5; 
            left = rect.left + scrollLeft + (rect.width / 2) - (tooltipWidth / 2); 
            break;
          case 'left':
            // 上移 2px
            top = rect.top + scrollTop + (rect.height / 2) - (tooltipHeight / 2) - 5; 
            left = rect.left + scrollLeft - tooltipWidth; 
            break;
          case 'right':
            // 上移 2px
            top = rect.top + scrollTop + (rect.height / 2) - (tooltipHeight / 2) - 5; 
            left = rect.right + scrollLeft; 
            break;
          case 'center':
            top = '50%';
            left = '50%';
            break;
          default:
            // 上移 2px
            top = rect.top + scrollTop - tooltipHeight - 4; 
            left = rect.left + scrollLeft + (rect.width / 2) - (tooltipWidth / 2); 
        }
  
        setTooltipPosition({ top, left });
      }
    }
    // 通知外部组件当前步骤发生变化
    onStepChange(currentGuideStep);
  }, [currentGuideStep, showGuide, onStepChange]);

  // 新增 useEffect 监听窗口尺寸变化
  useEffect(() => {
    const handleResize = () => {
      if (showGuide && GUIDE_STEPS[currentGuideStep]) {
        const targetElement = GUIDE_STEPS[currentGuideStep].target 
          ? document.querySelector(GUIDE_STEPS[currentGuideStep].target) 
          : null;
        if (targetElement) {
          const rect = targetElement.getBoundingClientRect();
          const scrollTop = window.scrollY;
          const scrollLeft = window.scrollX;
          let top, left;

          const tooltipElement = document.querySelector('.guide-tooltip');
          const tooltipWidth = tooltipElement ? tooltipElement.offsetWidth : 300;
          const tooltipHeight = tooltipElement ? tooltipElement.offsetHeight : 100;

          switch (GUIDE_STEPS[currentGuideStep].position) {
            case 'top':
              top = rect.top + scrollTop - tooltipHeight; 
              left = rect.left + scrollLeft + (rect.width / 2) - (tooltipWidth / 2); 
              break;
            case 'bottom':
              top = rect.bottom + scrollTop; 
              left = rect.left + scrollLeft + (rect.width / 2) - (tooltipWidth / 2); 
              break;
            case 'left':
              top = rect.top + scrollTop + (rect.height / 2) - (tooltipHeight / 2); 
              left = rect.left + scrollLeft - tooltipWidth; 
              break;
            case 'right':
              top = rect.top + scrollTop + (rect.height / 2) - (tooltipHeight / 2); 
              left = rect.right + scrollLeft; 
              break;
            case 'center':
              top = '50%';
              left = '50%';
              break;
            default:
              top = rect.top + scrollTop - tooltipHeight; 
              left = rect.left + scrollLeft + (rect.width / 2) - (tooltipWidth / 2); 
          }

          setTooltipPosition({ top, left });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentGuideStep, showGuide, onStepChange]);


  const handleNextStep = () => {
    if (currentGuideStep < GUIDE_STEPS.length - 1) {
      setCurrentGuideStep(currentGuideStep + 1);
    } else {
      setShowGuide(false);
      localStorage.setItem('hasSeenGuide', 'true');
    }
  };

  const handleSkipGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenGuide', 'true');
  };

  // 只有当 showGuide 和 showDelayedGuide 都为 true 时才显示引导
  if (!showGuide || !showDelayedGuide) return null;

  return (
    <>
      {GUIDE_STEPS[currentGuideStep] && (
        <GuideTooltip 
          step={GUIDE_STEPS[currentGuideStep]}
          onNext={handleNextStep}
          onSkip={handleSkipGuide}
          style={{
            top: tooltipPosition.top,
            left: tooltipPosition.left
          }}
          currentStepIndex={currentGuideStep}
        />
      )}
    </>
  );
}