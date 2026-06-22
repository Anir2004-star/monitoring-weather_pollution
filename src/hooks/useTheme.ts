import { useAppDispatch, useAppSelector } from '../store';
import { setTheme } from '../store/slices/uiSlice';

const useTheme = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.ui.theme);

  const toggleTheme = () => {
    dispatch(setTheme(theme === 'dark' ? 'light' : 'dark'));
  };

  return { theme, toggleTheme };
};

export default useTheme;
