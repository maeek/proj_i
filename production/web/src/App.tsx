import {
  AppShell,
  Burger,
  Header,
  MediaQuery,
  useMantineTheme,
  Text,
} from '@mantine/core';
import { useState } from 'react';
import Navbar from './components/navbar/navbar';
import { HashRouter, Navigate, Route, Routes } from "react-router-dom";
import './App.scss';
import { UserAddPage } from './pages/UserAdd';
import { PrinterAddPage } from './pages/PrinterAdd';
import { PrinterNewPrintPage } from './pages/PrinterNewPrint';

const App = () => {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);

  const header = (
    <Header height={70} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            opened={opened}
            onClick={() => setOpened((o) => !o)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text>3D printers management</Text>
      </div>
    </Header>
  );

  return (
    <HashRouter>
      <AppShell
        padding='md'
        fixed
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        navbar={<Navbar opened={opened} />}
        header={header}
        styles={{
          main: {
            background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0],
          },
        }}
      >
          <Routes>
            <Route path="/" element={<Navigate to="/user/add" replace />} />
            <Route path="/user/add" element={<UserAddPage />} />
            <Route path="/printer/add" element={<PrinterAddPage />} />
            <Route path="/printer/new-print" element={<PrinterNewPrintPage />} />
          </Routes>
      </AppShell>
    </HashRouter>
  );
}

export default App;
