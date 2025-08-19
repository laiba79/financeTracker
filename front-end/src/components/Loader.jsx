import { 
  CircularProgress, 
  Box, 
  Typography, 
  LinearProgress,
  Skeleton 
} from "@mui/material";
import { TrendingUp } from "@mui/icons-material";

export default function Loader({ 
  type = "circular", 
  message = "", 
  size = "medium",
  fullscreen = false 
}) {
  
  const getSize = () => {
    switch(size) {
      case "small": return 24;
      case "large": return 60;
      default: return 40;
    }
  };

  // Circular Loader (default)
  if (type === "circular") {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
          py: fullscreen ? 20 : 4,
          minHeight: fullscreen ? "50vh" : "auto"
        }}
      >
        <CircularProgress 
          size={getSize()} 
          sx={{ 
            color: "primary.main",
            mb: message ? 2 : 0 
          }} 
        />
        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  // Linear Progress Bar
  if (type === "linear") {
    return (
      <Box sx={{ width: '100%', py: 2 }}>
        <LinearProgress sx={{ height: 8, borderRadius: 4 }} />
        {message && (
          <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 1 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  // Skeleton Loaders for different content types
  if (type === "skeleton-list") {
    return (
      <Box sx={{ py: 2 }}>
        {[...Array(5)].map((_, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Skeleton variant="circular" width={40} height={40} sx={{ mr: 2 }} />
            <Box sx={{ flex: 1 }}>
              <Skeleton variant="text" width="60%" height={20} />
              <Skeleton variant="text" width="40%" height={16} />
            </Box>
            <Skeleton variant="rectangular" width={60} height={20} />
          </Box>
        ))}
      </Box>
    );
  }

  if (type === "skeleton-cards") {
    return (
      <Box sx={{ py: 2 }}>
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 2 }}>
          {[...Array(3)].map((_, index) => (
            <Box key={index} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <Skeleton variant="text" width="50%" height={24} sx={{ mb: 1 }} />
              <Skeleton variant="rectangular" width="100%" height={120} sx={{ mb: 2 }} />
              <Skeleton variant="text" width="80%" height={16} />
              <Skeleton variant="text" width="60%" height={16} />
            </Box>
          ))}
        </Box>
      </Box>
    );
  }

  // Custom Finance Tracker themed loader
  if (type === "finance") {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: "column",
          justifyContent: "center", 
          alignItems: "center",
          py: fullscreen ? 20 : 4,
          minHeight: fullscreen ? "50vh" : "auto"
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
          <CircularProgress
            size={getSize()}
            thickness={4}
            sx={{ 
              color: "success.main",
              position: 'absolute',
              animationDuration: '1.5s'
            }}
          />
          <CircularProgress
            size={getSize()}
            thickness={4}
            variant="determinate"
            value={25}
            sx={{ 
              color: "primary.main",
              transform: 'rotate(-90deg)!important'
            }}
          />
          <Box
            sx={{
              top: 0,
              left: 0,
              bottom: 0,
              right: 0,
              position: 'absolute',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <TrendingUp 
              sx={{ 
                fontSize: getSize() * 0.4, 
                color: 'primary.main' 
              }} 
            />
          </Box>
        </Box>
        
        <Typography 
          variant="h6" 
          color="primary" 
          sx={{ 
            fontWeight: 'bold',
            mb: 1,
            background: 'linear-gradient(45deg, #4CAF50, #2196F3)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Finance Tracker
        </Typography>
        
        {message ? (
          <Typography variant="body2" color="text.secondary">
            {message}
          </Typography>
        ) : (
          <Typography variant="body2" color="text.secondary">
            Loading your financial data...
          </Typography>
        )}
        
        <LinearProgress 
          sx={{ 
            width: 200, 
            mt: 2, 
            height: 4, 
            borderRadius: 2,
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(45deg, #4CAF50, #2196F3)'
            }
          }} 
        />
      </Box>
    );
  }

  // Dots loader
  if (type === "dots") {
    return (
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center",
          py: 4,
          gap: 1
        }}
      >
        {[...Array(3)].map((_, index) => (
          <Box
            key={index}
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              animation: `bounce 1.4s infinite ease-in-out both`,
              animationDelay: `${index * 0.16}s`,
              '@keyframes bounce': {
                '0%, 80%, 100%': {
                  transform: 'scale(0)'
                },
                '40%': {
                  transform: 'scale(1.0)'
                }
              }
            }}
          />
        ))}
        {message && (
          <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
            {message}
          </Typography>
        )}
      </Box>
    );
  }

  // Default fallback
  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
      <CircularProgress size={getSize()} />
    </Box>
  );
}