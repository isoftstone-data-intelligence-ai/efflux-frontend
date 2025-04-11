import React from 'react';
import styled from 'styled-components';
import { ExternalLink, Copy, RotateCw, X } from 'lucide-react';
import { toast } from '@/components/basicComp/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  overflow: hidden;

  .dark & {
    background: #18181B;
  }
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #E4E4E7;
  gap: 12px;
  justify-content: flex-end;
  .dark & {
    border-color: #3F3F46;
  }
`;

const CloseButton = styled.button`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  cursor: pointer;
  color: #71717A;
  transition: all 0.2s;

  &:hover {
    background: #F4F4F5;
    color: #18181B;
  }

  .dark & {
    &:hover {
      background: #27272A;
      color: #fff;
    }
  }

  svg {
    width: 16px;
    height: 16px;
  }
`;


export default function FragmentWeb({ result, onClose }) {

  return (
    <Container>
      <Header>
        <CloseButton onClick={onClose} title="Close">
          <X />
        </CloseButton>
      </Header>
    </Container>
  );
}
