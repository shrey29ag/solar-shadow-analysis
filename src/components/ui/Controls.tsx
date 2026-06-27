"use client";

import React, { useState } from "react";

interface NumberInputProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onChange: (val: number) => void;
}

export function NumberInput({
  label,
  value,
  min = -100,
  max = 100,
  step = 0.5,
  onChange,
}: NumberInputProps) {
  const [tempValue, setTempValue] = useState<string>(value.toString());

  // Sync temp state with external value changes
  React.useEffect(() => {
    setTempValue(value.toString());
  }, [value]);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    setTempValue(rawVal);

    const numVal = parseFloat(rawVal);
    if (!isNaN(numVal)) {
      // Clamp to min/max safety limits
      const clamped = Math.min(max, Math.max(min, numVal));
      onChange(clamped);
    }
  };

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numVal = parseFloat(e.target.value);
    onChange(numVal);
    setTempValue(numVal.toString());
  };

  const handleBlur = () => {
    // On blur, reset text field to the current clamped numerical value
    setTempValue(value.toString());
  };

  return (
    <div className="control-row">
      <label className="control-label">{label}</label>
      <div className="control-inputs">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="control-slider"
        />
        <input
          type="text"
          value={tempValue}
          onChange={handleTextChange}
          onBlur={handleBlur}
          className="control-number-box"
        />
      </div>
    </div>
  );
}

interface PropertySectionProps {
  title: string;
  children: React.ReactNode;
}

export function PropertySection({ title, children }: PropertySectionProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="property-section">
      <button 
        type="button" 
        className="property-section-header"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{title}</span>
        <span className={`chevron ${isOpen ? "open" : ""}`}>▼</span>
      </button>
      {isOpen && <div className="property-section-content">{children}</div>}
    </div>
  );
}
