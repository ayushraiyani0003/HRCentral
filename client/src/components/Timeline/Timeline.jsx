import React, { useState } from 'react';

const CustomizableTimeline = ({
  // Timeline data and configuration
  steps = [],
  currentStep = 0,
  orientation = 'vertical', // 'vertical' or 'horizontal'
  
  // Styling options
  theme = {
    // Colors for different states
    colors: {
      completed: 'bg-emerald-500 border-emerald-500 text-white',
      active: 'bg-blue-500 border-blue-500 text-white',
      pending: 'bg-white border-gray-300 text-gray-500',
      disabled: 'bg-gray-100 border-gray-200 text-gray-400'
    },
    
    // Size options
    size: 'md', // 'sm', 'md', 'lg'
    
    // Animation
    animated: true
  },
  
  // Event handlers
  onStepClick = () => {},
  onNext = () => {},
  onPrevious = () => {},
  onStepChange = () => {},
  
  // Content rendering
  renderStepContent = null,
  renderStepIndicator = null,
  
  // Behavior options
  clickableSteps = true,
  showNavigationButtons = false,
  allowSkipSteps = false,
  
  // Additional props
  className = '',
  style = {}
}) => {
  const [hoveredStep, setHoveredStep] = useState(null);
  
  // Size configurations
  const sizeConfig = {
    sm: {
      indicator: 'w-6 h-6',
      font: 'text-xs',
      spacing: 'gap-3',
      line: 'w-0.5',
      lineHeight: 'h-8',
      lineHorizontal: 'h-0.5',
      lineWidth: 'w-12',
      padding: 'p-2'
    },
    md: {
      indicator: 'w-8 h-8',
      font: 'text-sm',
      spacing: 'gap-4',
      line: 'w-0.5',
      lineHeight: 'h-12',
      lineHorizontal: 'h-0.5',
      lineWidth: 'w-16',
      padding: 'p-3'
    },
    lg: {
      indicator: 'w-10 h-10',
      font: 'text-base',
      spacing: 'gap-6',
      line: 'w-0.5',
      lineHeight: 'h-16',
      lineHorizontal: 'h-0.5',
      lineWidth: 'w-20',
      padding: 'p-4'
    }
  };
  
  const config = sizeConfig[theme.size] || sizeConfig.md;
  
  // Get step status
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'active';
    if (stepIndex > currentStep && !allowSkipSteps) return 'disabled';
    return 'pending';
  };
  
  // Get step classes
  const getStepClasses = (status) => {
    console.log(theme.colors[status]);
    // Uncaught TypeError: Cannot read properties of undefined (reading 'completed')
  //   theme.colors[status] is like 
  //   theme = {
  //   // Colors for different states
  //   colors: {
  //     completed: 'bg-emerald-500 border-emerald-500 text-white',
  //     active: 'bg-blue-500 border-blue-500 text-white',
  //     pending: 'bg-white border-gray-300 text-gray-500',
  //     disabled: 'bg-gray-100 border-gray-200 text-gray-400'
  //   },
    
  //   // Size options
  //   size: 'md', // 'sm', 'md', 'lg'
    
  //   // Animation
  //   animated: true
  // },
  
    return theme.colors[status] || theme.colors.pending;
  };
  
  // Handle step click
  const handleStepClick = (stepIndex, step) => {
    if (!clickableSteps) return;
    
    const status = getStepStatus(stepIndex);
    if (status === 'disabled') return;
    
    onStepClick(stepIndex, step, status);
    onStepChange(stepIndex, step);
  };
  
  // Get connection line color based on step status
  const getConnectionLineColor = (stepIndex) => {
    const currentStatus = getStepStatus(stepIndex);
    const nextStatus = getStepStatus(stepIndex + 1);
    
    // Line is completed if current step is completed
    if (currentStatus === 'completed') return 'bg-emerald-500';
    return 'bg-gray-200';
  };
  
  // Default step indicator renderer
  const defaultRenderStepIndicator = (step, stepIndex, status) => {
    const isHovered = hoveredStep === stepIndex;
    const stepClasses = getStepClasses(status);
    const isClickable = clickableSteps && status !== 'disabled';
    
    const baseClasses = `
      ${config.indicator} 
      rounded-full 
      border-2 
      flex 
      items-center 
      justify-center 
      relative 
      z-10
      ${stepClasses}
      ${isClickable ? 'cursor-pointer' : 'cursor-default'}
      ${theme.animated ? 'transition-all duration-300' : ''}
      ${isHovered && isClickable ? 'scale-110 shadow-lg' : ''}
    `;
    
    return (
      <div
        className={baseClasses}
        onMouseEnter={() => setHoveredStep(stepIndex)}
        onMouseLeave={() => setHoveredStep(null)}
        onClick={() => handleStepClick(stepIndex, step)}
      >
        {status === 'completed' ? (
          <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
          </svg>
        ) : status === 'active' ? (
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-current opacity-80" />
        ) : (
          <span className={`${config.font} font-semibold`}>
            {stepIndex + 1}
          </span>
        )}
      </div>
    );
  };
  
  // Render navigation buttons
  const renderNavigationButtons = () => {
    if (!showNavigationButtons) return null;
    
    return (
      <div className={`flex justify-between ${orientation === 'vertical' ? 'my-6 mx-5' : 'mx-6 my-5'}`}>
        <button
          onClick={onPrevious}
          disabled={currentStep === 0}
          className={`
            px-4 py-2 
            text-sm 
            font-medium 
            rounded-lg 
            border 
            transition-colors 
            duration-200
            ${currentStep === 0 
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400'
            }
          `}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentStep === steps.length - 1}
          className={`
            px-4 py-2 
            text-sm 
            font-medium 
            rounded-lg 
            border-0 
            transition-colors 
            duration-200
            ${currentStep === steps.length - 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
            }
          `}
        >
          Next
        </button>
      </div>
    );
  };
  
  // Render content for active step only (horizontal mode)
  const renderActiveStepContent = () => {
    if (orientation !== 'horizontal' || !steps[currentStep]) return null;
    
    const activeStep = steps[currentStep];
    const status = getStepStatus(currentStep);
    
    return (
      <div className={`mt-6 ${config.padding} bg-white border border-gray-200 rounded-lg shadow-sm`}>
        {renderStepContent ? 
          renderStepContent(activeStep, currentStep, status) : 
          <div>
            <h3 className={`${config.font} font-semibold text-gray-900 mb-2`}>
              {activeStep.title}
            </h3>
            {activeStep.description && (
              <p className={`${config.font} text-gray-600 leading-relaxed`}>
                {activeStep.description}
              </p>
            )}
          </div>
        }
      </div>
    );
  };
  
  return (
    <div className={`${className}`} style={style}>
      <div className={`relative`}>
        {orientation === 'vertical' ? (
          /* Vertical Timeline */
          <div className={`flex flex-col ${config.spacing}`}>
            {steps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex);
              
              return (
                <div key={step.id || stepIndex} className="relative">
                  {/* Connection Line Above (except for first step) */}
                  {stepIndex > 0 && (
                    <div 
                      className={`
                        absolute 
                        ${config.line} 
                        ${config.lineHeight}
                        ${getConnectionLineColor(stepIndex - 1)}
                        left-1/2 
                        transform 
                        -translate-x-1/2
                        -top-12
                        ${theme.animated ? 'transition-colors duration-300' : ''}
                      `}
                      style={{
                        top: orientation === 'vertical' ? '-3rem' : 0
                      }}
                    />
                  )}
                  
                  <div className="flex flex-row items-start gap-4 relative">
                    {/* Step Indicator */}
                    <div className="relative flex-shrink-0">
                      {renderStepIndicator ? 
                        renderStepIndicator(step, stepIndex, status) : 
                        defaultRenderStepIndicator(step, stepIndex, status)
                      }
                    </div>
                    
                    {/* Step Content */}
                    <div className="flex-1 min-w-0">
                      {renderStepContent ? 
                        renderStepContent(step, stepIndex, status) : 
                        <div>
                          <h3 className={`${config.font} font-semibold mb-1 ${
                            status === 'completed' ? 'text-emerald-600' :
                            status === 'active' ? 'text-blue-600' :
                            status === 'disabled' ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {step.title}
                          </h3>
                          {step.description && (
                            <p className={`${config.font} text-gray-600 leading-relaxed`}>
                              {step.description}
                            </p>
                          )}
                        </div>
                      }
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Horizontal Timeline */
          <div className="flex flex-row items-start gap-0 relative">
            {steps.map((step, stepIndex) => {
              const status = getStepStatus(stepIndex);
              
              return (
                <div key={step.id || stepIndex} className="flex flex-col items-center flex-1 relative">
                  {/* Connection Line to Left (except for first step) */}
                  {stepIndex > 0 && (
                    <div 
                      className={`
                        absolute 
                        ${config.lineHorizontal} 
                        ${config.lineWidth}
                        ${getConnectionLineColor(stepIndex - 1)}
                        right-full 
                        top-[29%]
                        left-[-50%]
                        w-full 
                        transform 
                        -translate-y-1/2
                        ${theme.animated ? 'transition-colors duration-300' : ''}
                      `}
                    />
                  )}
                  
                  {/* Step Indicator */}
                  <div className="relative flex-shrink-0 z-10">
                    {renderStepIndicator ? 
                      renderStepIndicator(step, stepIndex, status) : 
                      defaultRenderStepIndicator(step, stepIndex, status)
                    }
                  </div>
                  
                  {/* Step Title */}
                  <div className={`
                    text-center 
                    max-w-50 
                    mt-2
                    ${config.font} 
                    leading-tight
                    ${status === 'completed' ? 'text-emerald-600' :
                      status === 'active' ? 'text-blue-600 font-semibold' :
                      status === 'disabled' ? 'text-gray-400' : 'text-gray-500'
                    }
                  `}>
                    {step.title}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      {/* Active step content for horizontal mode */}
      {renderActiveStepContent()}
      
      {renderNavigationButtons()}
    </div>
  );
};

export default CustomizableTimeline;
