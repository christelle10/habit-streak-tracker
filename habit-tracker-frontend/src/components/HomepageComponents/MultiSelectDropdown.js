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
  width: 100%;
  position: relative; /* For arrow positioning */
`;

const OptionsList = styled.ul`
  position: absolute;
  font-size: 1rem;
  top: 100%;
  left: 0;
  width: 70%;
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
  display: flex;
  align-items: center;
  padding: 10px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #787676;
  }

  input {
    margin-right: 10px;
    pointer-events: all; /* Allow checkbox to handle clicks */
  }
`;

const CustomMultiDropdown = ({ options, selectedOptions, setSelectedOptions }) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionToggle = (option) => {
    setSelectedOptions((prevSelected) => {
      if (prevSelected.includes(option)) {
        // Remove the option if it was already selected
        return prevSelected.filter((item) => item !== option);
      } else {
        // Add the option to the selected list
        return [...prevSelected, option];
      }
    });
  };

  const selectedOptionsDisplay = selectedOptions.length
    ? selectedOptions.join(", ")
    : "Select days";

  return (
    <DropdownContainer>
      <SelectedDisplay onClick={() => setShowOptions((prev) => !prev)}>
        {selectedOptionsDisplay}
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
        {options.map((option) => (
          <OptionItem key={option}>
            <label>
              <input
                type="checkbox"
                checked={selectedOptions.includes(option)}
                onChange={() => handleOptionToggle(option)}
              />
              {option}
            </label>
          </OptionItem>
        ))}
      </OptionsList>
    </DropdownContainer>
  );
};
export default CustomMultiDropdown;
