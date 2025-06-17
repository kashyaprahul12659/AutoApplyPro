import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from './Tooltip';
import { useUser } from '../../hooks/useUniversalAuth';

/**
 * Plan Badge component - displays current plan status in header
 * Shows "Pro" for pro users or "Free - X credits left" for free users
 */
const PlanBadge = () => {
  const { user } = useUser();
  const isPro = user?.subscription?.isPro || false;
  const creditsLeft = user?.credits || 0;

  if (isPro) {
    return (
      <Tooltip text="You have access to all premium features">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          Pro
        </span>
      </Tooltip>
    );
  }

  return (
    <Tooltip text="Upgrade to Pro for unlimited access">
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
        Free - {creditsLeft} {creditsLeft === 1 ? 'credit' : 'credits'} left
      </span>
    </Tooltip>
  );
};

PlanBadge.propTypes = {
  className: PropTypes.string
};

export default PlanBadge;
