import { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import { createTheme } from '@mui/system';
import { CloseIcon } from 'yet-another-react-lightbox';
import IconButton from '@mui/material/IconButton';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuthContext } from 'src/auth/hooks';
import { Check, CopyAllOutlined } from '@mui/icons-material';
import { MuiTextField } from 'src/mui-components/FormHooks/MuiTextField';
import { main_app_routes } from 'src/routes/paths';


const theme = createTheme({
  palette: {
    primary: {
      main: '#00A67E',
    },
    secondary: {
      main: '#F5A623',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.3)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'rgba(255, 255, 255, 0.5)',
          },
        },
        notchedOutline: {
          borderColor: 'rgba(255, 255, 255, 0.2)',
        },
        input: {
          color: 'rgba(255, 255, 255, 0.8)',
          '&::placeholder': {
            color: 'rgba(255, 255, 255, 0.5)',
            opacity: 1,
          },
        },
      },
    },
  },
});

const ReferralIllustration = () => {
  return (
    <Box sx={{ position: 'relative', width: 120, height: 120 }}>
      {/* Credit card */}
      <Box
        sx={{
          position: 'absolute',
          top: 10,
          right: 20, // Shifted right position from 10 to 20
          width: 70,
          height: 50,
          bgcolor: '#9C6ADE',
          borderRadius: 2,
          transform: 'rotate(-10deg)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          zIndex: 2,
        }}
      >
        {/* Card details */}
        <Box sx={{ width: '80%', display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <Box sx={{ height: 4, width: '100%', bgcolor: 'white', borderRadius: 1 }} />
          <Box sx={{ height: 4, width: '60%', bgcolor: 'white', borderRadius: 1 }} />
          <Box sx={{ height: 4, width: '80%', bgcolor: 'white', borderRadius: 1 }} />
        </Box>
      </Box>

      {/* Coin */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 10,
          left: 20, // Shifted left position from 10 to 20
          width: 60,
          height: 60,
          bgcolor: '#F5A623',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0px 4px 10px rgba(0,0,0,0.1)',
          zIndex: 1,
          border: '2px solid #FFC65C',
        }}
      >
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold' }}>
          $
        </Typography>
      </Box>

      {/* Decorative elements */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          right: 15, // Shifted right position from 0 to 10
          width: 30,
          height: 30,
          bgcolor: '#F8E9FF',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 5,
          right: 30, // Shifted right position from 20 to 30
          width: 20,
          height: 20,
          bgcolor: '#FFD9B3',
          borderRadius: '50%',
          zIndex: 0,
        }}
      />
    </Box>
  );
};


interface ReferralDialogProps {
  open: boolean;
  onClose: () => void;
}

export default function ReferralDialog({ open, onClose }: ReferralDialogProps) {
  const [email, setEmail] = useState('');

  const [copied, setCopied] = useState(false);
  const { user } = useAuthContext();
  const inviteLink = `${window.location.origin}${`${main_app_routes.public.leads}/create`}?referral_code=${user?.referral_code}`;

  console.log("inviteLink ==>", inviteLink)


  const handleLinkCopy = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    const btn = document.activeElement as HTMLButtonElement;
    const icon = btn.querySelector('svg');
    setTimeout(() => {
      setCopied(false)
    }, 1000);
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(user?.referral_code || '');
    const btn = document.activeElement as HTMLButtonElement;
    const icon = btn.querySelector('svg');
    if (icon) {
      icon.style.transition = 'transform 0.2s ease';
      icon.style.transform = 'scale(0)';
      setTimeout(() => {
        icon.innerHTML = `<path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>`;
        icon.style.transform = 'scale(1)';
      }, 200);
      setTimeout(() => {
        icon.style.transform = 'scale(0)';
        setTimeout(() => {
          icon.innerHTML = `<path d="M19,21H8V7H19M19,5H8A2,2 0 0,0 6,7V21A2,2 0 0,0 8,23H19A2,2 0 0,0 21,21V7A2,2 0 0,0 19,5M16,1H4A2,2 0 0,0 2,3V17H4V3H16V1Z"/>`;
          icon.style.transform = 'scale(1)';
        }, 200);
      }, 1000);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          position: 'relative',
          p: 3,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            zIndex: 100,
            color: 'black',
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box sx={{ maxWidth: '60%' }}>
            <Typography variant="h5" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              Share Referral Link
            </Typography>
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold', mb: 2 }}>
              {user?.referral_code}
              <IconButton onClick={() => {
                handleCopy();
              }}>
                <CopyAllOutlined sx={{ color: 'white', fontSize: 20 }} />
              </IconButton>
            </Typography>

          </Box>
          <ReferralIllustration />
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 3 }}>
          <MuiTextField
            name="email"
            fullWidth
            placeholder="Email"
            variant="outlined"
            value={inviteLink}
            // onChange={handleEmailChange}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 44,
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: "white",
                '& input::placeholder': {
                  color: 'white',
                  opacity: 1
                }
              },

            }}
          />
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLinkCopy}
            sx={{
              minWidth: 100,
              height: 44,
              fontWeight: 'bold',
              boxShadow: '0px 4px 10px rgba(245, 166, 35, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            {copied ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Check sx={{ fontSize: 20 }} />
                <Box component="span" sx={{ ml: 0.5 }}>Copied!</Box>
              </Box>
            ) : (
              'Copy'
            )}
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
