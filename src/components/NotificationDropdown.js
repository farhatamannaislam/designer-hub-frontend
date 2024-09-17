import React, { useState, useEffect, useRef } from "react";


const Dropdown = ({ options, onOpen, newField, IconElement, noOptionsMessage = "No options available" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (!isOpen) onOpen(); 
  };

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <span
        className={styles.dropdownButton}
        onClick={handleToggle}
        role="button"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {React.cloneElement(IconElement)}
      </span>
      {isOpen && (
        <div className={styles.popover} role="menu">
          {options?.length > 0 ? (
            <ul className={styles.dropdownOptions}>
              {options.map((option) => (
                <li
                  key={option.id}
                  className={
                    !option[newField]
                      ? styles.dropdownOptionNew
                      : styles.dropdownOption
                  }
                >
                  {option.message}
                </li>
              ))}
            </ul>
          ) : (
            <div className={styles.noOptionsMessage}>{noOptionsMessage}</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
