/* eslint-disable react/no-unused-prop-types */

import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  align-items: center;

  button {
    width: 20px;
    svg {
      path {
        fill: #0d0d0d;
      }
    }
  }
`;

const Apr = ({ value, originalValue }) => {
  return originalValue !== 0 ? (
    <Container>
      <>
        <div className="min-w-[60px] text-left text-symbol text-[11px] md:text-sm font-semibold">
          {value}%
        </div>
      </>
    </Container>
  ) : (
    <Container>
      <div className="min-w-[60px] text-left text-symbol text-[11px] md:text-sm font-semibold">
        {originalValue}%
      </div>
    </Container>
  );
};

export default Apr;
