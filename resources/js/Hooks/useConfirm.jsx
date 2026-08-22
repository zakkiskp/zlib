import { useState, useCallback } from 'react';

/**
 * Dipakai bareng <ConfirmDialog>. Contoh:
 *
 *   const { confirmState, confirm, handleConfirm, handleCancel } = useConfirm();
 *   const hapus = async () => {
 *       const ok = await confirm('Hapus Data?', 'Tindakan ini tidak bisa dibatalkan.');
 *       if (ok) router.delete(...);
 *   };
 *   <ConfirmDialog open={confirmState.open} title={confirmState.title}
 *       message={confirmState.message} onConfirm={handleConfirm} onCancel={handleCancel} />
 */
export function useConfirm() {
    const [state, setState] = useState({ open: false, title: '', message: '', resolve: null });

    const confirm = useCallback((title, message) => {
        return new Promise((resolve) => {
            setState({ open: true, title, message, resolve });
        });
    }, []);

    const handleConfirm = () => {
        state.resolve?.(true);
        setState((s) => ({ ...s, open: false }));
    };

    const handleCancel = () => {
        state.resolve?.(false);
        setState((s) => ({ ...s, open: false }));
    };

    return { confirmState: state, confirm, handleConfirm, handleCancel };
}
