import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface HalfStarRatingProps {
  value: number; // e.g. 3.5
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showNumber?: boolean;
}

export const HalfStarRating: React.FC<HalfStarRatingProps> = ({
  value,
  onChange,
  readOnly = false,
  size = 'md',
  showNumber = true
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const displayValue = hoverValue !== null ? hoverValue : value;

  const starSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (readOnly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    setHoverValue(starIndex + (isHalf ? 0.5 : 1.0));
  };

  const handleClick = (starIndex: number, e: React.MouseEvent<HTMLDivElement>) => {
    if (readOnly || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isHalf = x < rect.width / 2;
    let newValue = starIndex + (isHalf ? 0.5 : 1.0);
    
    if (newValue === value) {
      newValue = 0;
    }
    
    onChange(newValue);
  };

  return (
    <div className="flex items-center gap-2 select-none">
      <div
        className="flex items-center gap-1"
        onMouseLeave={() => setHoverValue(null)}
      >
        {[0, 1, 2, 3, 4].map((starIndex) => {
          const fullThreshold = starIndex + 1;
          const halfThreshold = starIndex + 0.5;

          const isFull = displayValue >= fullThreshold;
          const isHalf = displayValue >= halfThreshold && displayValue < fullThreshold;

          return (
            <div
              key={starIndex}
              className={`relative cursor-${readOnly ? 'default' : 'pointer'} transition-transform active:scale-110`}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              onClick={(e) => handleClick(starIndex, e)}
            >
              {/* Star Background */}
              <Star
                className={`${starSizes[size]} text-[#E0D8CC] fill-[#F2EDE4] stroke-[1.5]`}
              />

              {/* Full Star Overlay */}
              {isFull && (
                <Star
                  className={`absolute top-0 left-0 ${starSizes[size]} text-[#F2C94C] fill-[#f59e0b] stroke-[1.5]`}
                />
              )}

              {/* Half Star Overlay */}
              {isHalf && (
                <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
                  <Star
                    className={`${starSizes[size]} text-[#F2C94C] fill-[#f59e0b] stroke-[1.5]`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNumber && (
        <span className="font-semibold text-sm text-[#D46A43] min-w-[2.2rem]">
          {displayValue.toFixed(1)} ★
        </span>
      )}
    </div>
  );
};
