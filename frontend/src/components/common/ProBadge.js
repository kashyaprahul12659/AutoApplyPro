import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';

/**
 * Pro Badge component - displays a small, classy badge for Pro users
 * @param {Object} props - Component props
 * @param {string} props.size - Badge size (sm, md)
 * @param {boolean} props.showTooltip - Whether to show tooltip on hover
 */
const ProBadge = ({ size = 'sm', showTooltip = true }) => {
  const badge = (
    <span
      className={`
        inline-flex items-center justify-center rounded-full 
        bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium
        ${size === 'sm' ? 'text-xs px-1.5 py-0.5' : 'text-sm px-2 py-1'}
      `}
    >
      Pro
    </span>
  );

  if (showTooltip) {
    return (
      <Tooltip text="Pro Plan - Access to all premium features">
        {badge}
      </Tooltip>
    );
  }

  return badge;
};

ProBadge.propTypes = {
  size: PropTypes.oneOf(['sm', 'md']),
  showTooltip: PropTypes.bool
};

export default ProBadge;
