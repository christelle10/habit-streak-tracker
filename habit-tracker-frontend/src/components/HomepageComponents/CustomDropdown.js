import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
  display: inline-block;
  width: 100%;
  cursor: pointer;
`;

const ArrowIcon = styled.svg`
  position: absolute;
  top: 25%;
  right: 15px;
  transform: ${(props) => (props.show ? "rotate(0)" : "rotate(-180deg)")};
  transition: transform 0.3s ease;
  pointer-events: none; /* Prevent arrow from interfering with clicks */
`;

const SelectedDisplay = styled.div`
  padding: 10px;
  font-size: 1rem;
  background-color: #959595;
  color: white;
  border-radius: 10px;
  width: 80%;
  position: relative; /* For arrow positioning */
`;

const OptionsList = styled.ul`
  position: absolute;
  font-size: 1rem;
  top: 100%;
  left: 0;
  width: 80%;
  background-color: #959595;
  list-style: none;
  margin: 0;
  padding: 0;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  visibility: ${(props) => (props.show ? "visible" : "hidden")};
  opacity: ${(props) => (props.show ? "1" : "0")};
  transform: ${(props) => (props.show ? "translateY(0)" : "translateY(-10px)")};
  transition: all 0.3s;
`;

const OptionItem = styled.li`
  padding: 10px;
  color: white;
  &:hover {
    background-color: #787676;
  }
`;

const CustomDropdown = ({ options, selectedOption, setSelectedOption }) => {
  const [showOptions, setShowOptions] = useState(false);

  // Map display names to values
  const valueMap = {
    Daily: "daily",
    Weekly: "weekly",
  };

  const handleSelect = (displayValue) => {
    const mappedValue = valueMap[displayValue]; // Map display to actual value
    setSelectedOption(mappedValue); // Update the parent state
    setShowOptions(false); // Close the dropdown
  };

  return (
    <DropdownContainer>
      <SelectedDisplay onClick={() => setShowOptions((prev) => !prev)}>
        {selectedOption
          ? Object.keys(valueMap).find((key) => valueMap[key] === selectedOption)
          : "Select an option"}
        <ArrowIcon
          show={showOptions}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            d="M7 14.5l5-5 5 5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </ArrowIcon>
      </SelectedDisplay>
      <OptionsList show={showOptions}>
        {options.map((displayValue) => (
          <OptionItem
            key={displayValue}
            onClick={() => handleSelect(displayValue)}
          >
            {displayValue}
          </OptionItem>
        ))}
      </OptionsList>
    </DropdownContainer>
  );
};

export default CustomDropdown;
