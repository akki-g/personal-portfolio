/* eslint-disable react/prop-types */

// Link that opens in a new tab.
function External({ href, children, className }) {
  return (
    <a href={href} className={className} target="_blank" rel="noreferrer">{children}</a>
  );
}

export default External;
