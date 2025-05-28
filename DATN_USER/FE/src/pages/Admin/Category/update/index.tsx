import * as React from "react";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { X } from "lucide-react";
import UpdateComponent from "./Update";
import { ICategory } from "../../../../common/interfaces/Category";
import { FaEdit } from "react-icons/fa";
import { Button } from "antd";
interface CategoryUpdateProps {
  id?: string;
  data: ICategory[];
  disabled: boolean;
}

export default function CategoryCreate({
  id,
  data,
  disabled,
}: CategoryUpdateProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button onClick={handleClickOpen} type="primary" disabled={disabled}>
        <FaEdit />
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          <div
            className="absolute top-2 right-2  cursor-pointer"
            onClick={handleClose}
          >
            <X />
          </div>
        </DialogTitle>
        <DialogContent>
          <Box className="p-5">
            <UpdateComponent id={id} data={data} />
          </Box>
        </DialogContent>
      </Dialog>
    </div>
  );
}
