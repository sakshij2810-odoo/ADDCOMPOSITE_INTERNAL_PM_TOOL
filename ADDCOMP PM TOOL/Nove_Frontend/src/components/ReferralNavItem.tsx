import { useState } from 'react';
import ReferralDialog from './ReferralDialog';

export default function ReferralNavItem() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div onClick={handleOpen} style={{ display: 'contents' }} />
      <ReferralDialog open={open} onClose={handleClose} />
    </>
  );
} 