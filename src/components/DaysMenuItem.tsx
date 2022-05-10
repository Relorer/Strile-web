import { Box, Grid, Typography } from "@mui/material";

interface DaysMenuProps {
  date: Date;
  selected: boolean;
}

const DaysMenuItem = ({ date, selected }: DaysMenuProps) => {
  return (
    <Box sx={{ textAlign: "center", p: 1, cursor: "pointer" }}>
      <Typography sx={{ color: "#c5c4c4" }}>
        <Box sx={{ fontWeight: "lighter" }}>
          {date.toLocaleDateString("En-en", {
            weekday: "short",
          })}
        </Box>
      </Typography>
      <Grid
        container
        spacing={0}
        direction="column"
        alignItems="center"
        justifyContent="center"
        width={35}
        height={35}
        sx={{
          background: selected ? "#0971f1" : "transparent",
          borderRadius: 100,
        }}
      >
        <Grid item xs={3}>
          <Typography
            sx={{
              color: selected ? "white" : "black",
            }}
          >
            {date.getDate()}
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DaysMenuItem
