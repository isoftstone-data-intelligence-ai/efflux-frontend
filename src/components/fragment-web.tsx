import React from 'react';
import styled from 'styled-components';
import { ExternalLink, Copy, RotateCw, X } from 'lucide-react';
import { toast } from '@/components/basicComp/Toast';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #fff;
  border-radius: 16px;
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

const UrlBar = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-right: 16px;
  padding: 6px 12px;
  background: #F4F4F5;
  border-radius: 6px;
  font-size: 14px;
  color: #71717A;
  min-height:29px;

  .dark & {
    background: #27272A;
  }
`;

const Actions = styled.div`
  display: flex;
  gap: 8px;

  button {
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
  }
`;

const Content = styled.div`
  flex: 1;
  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;

interface FragmentWebProps {
  result: any;
  onClose?: () => void;
}

export function FragmentWeb({ result, onClose }: FragmentWebProps) {
  const [iframeKey, setIframeKey] = React.useState(0);

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(result.url);
      toast.success('URL copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy URL');
    }
  };

  const handleOpenInNewTab = () => {
    window.open(result.url, '_blank');
  };

  const refreshIframe = () => {
    setIframeKey((prevKey) => prevKey + 1);
  };

  if (!result) return null;

  return (
    <Container>
      <Header>
        <Actions>
          <button onClick={refreshIframe} title="Refresh">
            <RotateCw />
          </button>
        </Actions>
        <UrlBar>{result.url}</UrlBar>
        <Actions>
          <button onClick={handleCopyUrl} title="Copy URL">
            <Copy />
          </button>
          {/* <button onClick={handleOpenInNewTab} title="Open in new tab">
            <ExternalLink />
          </button> */}
          <CloseButton onClick={onClose} title="Close">
            <X />
          </CloseButton>
        </Actions>
      </Header>
      <Content>
        <iframe key={iframeKey} src={result.url} />
      </Content>
    </Container>
  );
}
