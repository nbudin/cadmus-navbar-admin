import React from 'react';

export type AddButtonProps = {
  children: React.ReactNode;
  onClick: () => void;
};

export default function AddButton({ children, onClick }: AddButtonProps): JSX.Element {
  return (
    <button type="button" className="btn btn-sm btn-secondary" onClick={onClick}>
      {children}
    </button>
  );
}
