import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

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
  
  return (
    <form className={cn("grid items-start gap-4", className)}>
      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={parentPassword}
          onChange={(e) => {
            if (setparentPassword) {
              setparentPassword(e.target.value);
            }
          }}
        />
      </div>
      {renderFooter && renderFooter()}
    </form>
  );
};

export default PasswordForm;
