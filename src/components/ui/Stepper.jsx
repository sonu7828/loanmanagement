import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Check } from 'lucide-react';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Stepper = ({ steps, currentStep }) => {
  return (
    <div className="w-full py-6 lg:px-4">
      {/* Mobile Step Indicator */}
      <div className="lg:hidden text-center mb-6">
        <p className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">
          Step {currentStep + 1} of {steps.length}
        </p>
        <h4 className="text-sm font-bold text-slate-200 mt-1">{steps[currentStep]}</h4>
      </div>

      <div className="flex items-center justify-between relative">
        {/* Progress Line - Background Layer */}
        <div className="absolute top-1/2 left-0 w-full h-[3px] bg-slate-800 -translate-y-1/2 z-0"></div>
        {/* Progress Line - Active Layer */}
        <div
          className="absolute top-1/2 left-0 h-[3px] bg-blue-600 -translate-y-1/2 z-0 transition-all duration-700 shadow-[0_0_15px_rgba(47,128,237,0.4)]"
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>

        {steps.map((step, index) => (
          <div key={index} className="relative z-10 flex flex-col items-center group">
            <div className={cn(
              "w-10 h-10 lg:w-12 lg:h-12 rounded-2xl flex items-center justify-center border-2 transition-all duration-500",
              index < currentStep
                ? "bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-500/20"
                : index === currentStep
                  ? "bg-white border-blue-600 text-blue-600 shadow-xl shadow-blue-500/10 scale-110"
                  : "bg-white border-slate-700 text-slate-500"
            )}>
              {index < currentStep ? (
                <Check className="w-5 h-5 lg:w-6 lg:h-6 animate-in zoom-in duration-300" />
              ) : (
                <span className="font-black text-xs lg:text-sm">{index + 1}</span>
              )}
            </div>
            <span className={cn(
              "absolute -bottom-10 whitespace-nowrap text-[9px] font-black uppercase tracking-[0.2em] transition-all duration-500 hidden lg:block",
              index <= currentStep ? "text-blue-500 translate-y-0" : "text-slate-500 translate-y-1 opacity-60"
            )}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
