// useConfirmBox.ts
import { useState } from 'react';

export function useConfirmBox() {
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState<(() => void) | null>(null);

    const confirmBox = (msg: string, onConfirm: () => void) => {
        setMessage(msg);
        setIsConfirmOpen(true);
        setConfirmCallback(() => onConfirm);
    };

    const ConfirmModal = () => (
        isConfirmOpen && (
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 2000
            }}>
                <div style={{
                    background: '#ffffff',
                    padding: '20px',
                    borderRadius: '10px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
                    width: '100%',
                    maxWidth: '400px',
                    boxSizing: 'border-box',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px',
                    textAlign: 'center'
                }}>
                    <h2 style={{ fontSize: '20px', fontWeight: '600', color: '#2c3e50', marginBottom: '10px' }}>
                        Confirm Delete
                    </h2>
                    <p style={{ fontSize: '16px', color: '#7f8c8d' }}>{message}</p>
                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                        <button
                            onClick={() => {
                                setIsConfirmOpen(false);
                                setConfirmCallback(null);
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#e74c3c',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease, transform 0.2s ease',
                            }}
                            onMouseOver={(e) => (e.currentTarget.style.background = '#c0392b')}
                            onMouseOut={(e) => (e.currentTarget.style.background = '#e74c3c')}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Cancel
                        </button>
                        <button
                            onClick={() => {
                                if (confirmCallback) confirmCallback();
                                setIsConfirmOpen(false);
                                setConfirmCallback(null);
                            }}
                            style={{
                                padding: '10px 20px',
                                background: '#2ecc71',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '6px',
                                fontSize: '16px',
                                fontWeight: '500',
                                cursor: 'pointer',
                                transition: 'background 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = '#27ae60';
                                e.currentTarget.style.boxShadow = '0 4px 10px rgba(39, 174, 96, 0.3)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = '#2ecc71';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                            onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.98)')}
                            onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        )
    );

    return { confirmBox, ConfirmModal };
}