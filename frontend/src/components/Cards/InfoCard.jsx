import React from 'react';


const COLOR_CLASSES = {
  blue: 'bg-gradient-to-r from-indigo-600 to-blue-500',
  red: 'bg-gradient-to-r from-rose-600 to-pink-500',
  yellow: 'bg-gradient-to-r from-yellow-500 to-amber-400',
  green: 'bg-gradient-to-r from-green-600 to-teal-500',
  purple: 'bg-gradient-to-r from-purple-600 to-violet-500',
  gray: 'bg-gradient-to-r from-gray-600 to-gray-500',
};



const InfoCard = ({ icon, label, value, color = 'blue', className = '' }) => {
  const colorClass = COLOR_CLASSES[color] || COLOR_CLASSES.blue;

  return (
    <li
      className={`
        flex items-center gap-2 p-2.5 rounded-md shadow
        transition-transform transform hover:scale-101 hover:shadow-md
        ${colorClass}
        cursor-default
        ${className}
      `}
      role="listitem"
      tabIndex={0}
      aria-label={`${label} info card`}
      title={`${label}: ${value}`}
    >
      <div
        className="
          flex items-center justify-center
          rounded-full bg-white/20 backdrop-blur-xs shadow-inner
          flex-shrink-0
        "
        style={{
          width: 'clamp(1.5rem, 2.5vw, 2rem)',
          height: 'clamp(1.5rem, 2.5vw, 2rem)',
        }}
        aria-hidden="true"
      >
        {React.cloneElement(icon, { className: 'text-white', size: '1.2rem' })}
      </div>

      <div className="truncate">
        <p
          className="text-white/90 font-medium tracking-wide leading-snug truncate"
          style={{ fontSize: 'clamp(0.65rem, 1vw, 0.8rem)' }}
        >
          {label}
        </p>
        <p
          className="text-white font-semibold mt-0.5 leading-tight truncate"
          style={{ fontSize: 'clamp(0.8rem, 1.2vw, 1rem)' }}
        >
          {value}
        </p>
      </div>
    </li>
  );
};

export default InfoCard;
