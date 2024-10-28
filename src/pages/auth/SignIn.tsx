import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { checkSalesRepAccess } from '@/lib/firebase-auth';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Lock,
  Mail,
  Visibility,
  VisibilityOff,
  ArrowForward,
} from '@mui/icons-material';

export function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { signIn, sendLoginLink } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const validateForm = () => {
    if (!email) {
      setError('Email is required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    if (!password) {
      setError('Password is required');
      return false;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const isSalesRep = await checkSalesRepAccess(email);
      if (!isSalesRep) {
        throw new Error('Unauthorized access');
      }

      await signIn(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Invalid email or password');
      toast({
        title: 'Error',
        description: 'Invalid email or password',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordlessSignIn = async () => {
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      await sendLoginLink(email);
      toast({
        title: 'Success',
        description: 'Check your email for the sign-in link',
      });
      localStorage.setItem('emailForSignIn', email);
    } catch (error) {
      setError('Failed to send sign-in link');
      toast({
        title: 'Error',
        description: 'Failed to send sign-in link',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing(2),
      }}
    >
      <Card
        elevation={6}
        sx={{
          width: '100%',
          maxWidth: 440,
          borderRadius: 2,
        }}
      >
        <CardContent sx={{ padding: theme.spacing(4) }}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mb: 4,
            }}
          >
            <Lock
              sx={{
                fontSize: 40,
                color: theme.palette.primary.main,
                mb: 2,
              }}
            />
            <Typography
              variant="h5"
              component="h1"
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                textAlign: 'center',
              }}
            >
              Sales Portal Sign In
            </Typography>
          </Box>

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSignIn}>
            <TextField
              fullWidth
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              fullWidth
              type={showPassword ? 'text' : 'password'}
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: theme.palette.text.secondary }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              disabled={isLoading}
              sx={{
                mt: 3,
                mb: 2,
                height: 48,
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark,
                },
              }}
              endIcon={<ArrowForward />}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>

          <Divider sx={{ my: 3 }}>
            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary }}
            >
              Or continue with
            </Typography>
          </Divider>

          <Button
            fullWidth
            variant="outlined"
            onClick={handlePasswordlessSignIn}
            disabled={isLoading || !email}
            sx={{
              height: 48,
              borderColor: theme.palette.secondary.main,
              color: theme.palette.secondary.main,
              '&:hover': {
                borderColor: theme.palette.secondary.dark,
                backgroundColor: 'transparent',
              },
            }}
          >
            Sign in with email link
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}