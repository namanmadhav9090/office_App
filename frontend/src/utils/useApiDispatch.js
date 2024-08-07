import { useDispatch } from 'react-redux';
// Import your Redux actions here
// import { setLoading, setError, clearError } from '../redux/actions';

const useApiDispatch = () => {
  const dispatch = useDispatch();

  const setLoading = (loading) => dispatch({ type: 'SET_LOADING', payload: loading });
  const setError = (error) => dispatch({ type: 'SET_ERROR', payload: error });
  const clearError = () => dispatch({ type: 'CLEAR_ERROR' });

  return { setLoading, setError, clearError };
};

export default useApiDispatch;
