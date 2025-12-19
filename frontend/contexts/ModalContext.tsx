'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';

interface ModalOptions {
  title?: string;
  content: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  onClose?: () => void;
}

interface ModalContextType {
  openModal: (options: ModalOptions) => void;
  closeModal: () => void;
  confirm: (title: string, message: string) => Promise<boolean>;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export function ModalProvider({ children }: { children: ReactNode }) {
  const [modalState, setModalState] = useState<(ModalOptions & { open: boolean }) | null>(null);
  const [confirmResolver, setConfirmResolver] = useState<((value: boolean) => void) | null>(null);

  const openModal = useCallback((options: ModalOptions) => {
    setModalState({ ...options, open: true });
  }, []);

  const closeModal = useCallback(() => {
    if (modalState?.onClose) {
      modalState.onClose();
    }
    setModalState(null);
    if (confirmResolver) {
      confirmResolver(false);
      setConfirmResolver(null);
    }
  }, [modalState, confirmResolver]);

  const confirm = useCallback((title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setConfirmResolver(() => resolve);
      openModal({
        title,
        content: message,
        maxWidth: 'sm',
        fullWidth: true,
        actions: (
          <>
            <Button onClick={() => {
              resolve(false);
              closeModal();
            }}>
              Скасувати
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                resolve(true);
                closeModal();
              }}
            >
              Підтвердити
            </Button>
          </>
        ),
      });
    });
  }, [openModal, closeModal]);

  return (
    <ModalContext.Provider value={{ openModal, closeModal, confirm }}>
      {children}
      {modalState && (
        <Dialog
          open={modalState.open}
          onClose={closeModal}
          maxWidth={modalState.maxWidth || 'md'}
          fullWidth={modalState.fullWidth}
        >
          {modalState.title && (
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              {modalState.title}
              <IconButton
                edge="end"
                color="inherit"
                onClick={closeModal}
                aria-label="close"
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
          )}
          <DialogContent>
            {modalState.content}
          </DialogContent>
          {modalState.actions && (
            <DialogActions>
              {modalState.actions}
            </DialogActions>
          )}
        </Dialog>
      )}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error('useModal must be used within ModalProvider');
  }
  return context;
}

