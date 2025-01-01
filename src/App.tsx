import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/tiptap/styles.css';
import '@css/index.scss';
import '@css/reset.css';
import { MantineProvider } from '@mantine/core';
import { Router } from '@routes/Router';
import { theme } from '@shared/theme';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Router />
      <ToastContainer />
    </MantineProvider>
  );
}
