import { useMutation } from '@tanstack/react-query';
import { Button } from '../ui/button';
import Axios from '@/api-config';

const ActionButton = ({
  username,
  process,
  changeStatus,
}: {
  username: string;
  process: string;
  changeStatus?: () => void;
}) => {
  const mutation = useMutation({
    mutationFn: async () => {
      return await Axios.post('/users/actions', {
        username,
        process,
      });
    },
    onSuccess() {
      changeStatus && changeStatus();
    },
  });

  return (
    <Button onClick={() => mutation.mutate()} className="capitalize">
      {process}
    </Button>
  );
};

export default ActionButton;
