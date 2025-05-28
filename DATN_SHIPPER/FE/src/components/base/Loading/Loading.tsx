import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";

const Loading = () => {
  return (
    <div className="container mx-auto h-screen ">
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
        <CircularProgress />
      </Box>
    </div>
  );
};

export default Loading;
