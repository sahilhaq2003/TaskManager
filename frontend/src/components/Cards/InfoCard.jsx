import React from 'react';

const COLOR_CLASSES = {
  blue: 'bg-gradient-to-r from-indigo-600 to-blue-500',
  red: 'bg-gradient-to-r from-rose-600 to-pink-500',
  yellow: 'bg-gradient-to-r from-yellow-500 to-amber-400',
  green: 'bg-gradient-to-r from-green-600 to-teal-500',
  purple: 'bg-gradient-to-r from-purple-600 to-violet-500',
  gray: 'bg-gradient-to-r from-gray-600 to-gray-500',
};

const InfoCard = ({ icon, label, value, color = 'blue' }) => {
  const colorClass = COLOR_CLASSES[color] || COLOR_CLASSES.blue;

  return (
    <article
      className={`
        flex items-center justify-between p-4 rounded-xl shadow-md
        transition-transform transform hover:scale-105 hover:shadow-lg
        ${colorClass}
        w-full max-w-md
      `}
      role="region"
      aria-label={`${label} info card`}
      tabIndex={0}
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div
          className="
            flex items-center justify-center
            rounded-full bg-white/25 backdrop-blur-md shadow-inner
            flex-shrink-0
          "
          style={{
            width: 'clamp(2.5rem, 4vw, 3.5rem)',
            height: 'clamp(2.5rem, 4vw, 3.5rem)',
          }}
          aria-hidden="true"
        >
          {icon}
        </div>

        <div className="truncate">
          <p
            className="text-white/90 font-medium tracking-wide leading-snug truncate"
            style={{ fontSize: 'clamp(0.875rem, 1.5vw, 1rem)' }}
            title={label}
          >
            {label}
          </p>
          <p
            className="text-white font-bold mt-1 leading-tight truncate"
            style={{ fontSize: 'clamp(1rem, 2vw, 1.25rem)' }}
            title={value}
          >
            {value}
          </p>
        </div>
      </div>
    </article>
  );
};

export default InfoCard;
