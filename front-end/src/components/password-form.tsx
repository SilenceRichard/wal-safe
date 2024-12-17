import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface Props {
  parentPassword?: string;
  setparentPassword?: (v: string) => void;
  className?: string;
  renderFooter?: () => React.ReactNode;
}

const PasswordForm = ({
  className,
  renderFooter,
  parentPassword,
  setparentPassword,
}: Props) => {
  const [visible, setvisible] = useState(false);
  const toggleVisibility = () => {
    setvisible(!visible);
  };
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="flex items-center">
          <Input
            id="password"
            type={visible ? "text" : "password"}
            value={parentPassword}
            onChange={(e) => {
              if (setparentPassword) {
                setparentPassword(e.target.value);
              }
            }}
          />
          {visible ? (
            <EyeClosed
              className="ml-2 cursor-pointer hover:opacity-50"
              onClick={toggleVisibility}
            />
          ) : (
            <Eye className="ml-2 cursor-pointer hover:opacity-50" onClick={toggleVisibility} />
          )}
        </div>
      </div>
      {renderFooter && renderFooter()}
    </form>
  );
};

export default PasswordForm;
