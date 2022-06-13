import {
  Navbar as NavbarMantine,
  Text,
  Group,
  ThemeIcon,
  UnstyledButton,
  Anchor
} from '@mantine/core';
import { Link } from 'react-router-dom'
import { UserPlus, Printer, File3d } from 'tabler-icons-react';
import './navbar.scss';

const Navbar = ({ opened }: { opened?: boolean }) => {
  const items = [
    { path: '/user/add', icon: <UserPlus size={16} />, color: 'blue', label: 'Dodaj użytkownika' },
    { path: '/printer/add', icon: <Printer size={16} />, color: 'teal', label: 'Dodaj drukarkę' },
    { path: '/printer/new-print', icon: <File3d size={16} />, color: 'violet', label: 'Dodaj druk' },
  ];

  return (
    <NavbarMantine p="md" hiddenBreakpoint="sm" hidden={!opened} width={{ sm: 200, lg: 300 }}>
      {
        items.map(({ label, icon, color, path }) => (
          <NavbarMantine.Section key={path}>
            <Anchor component={Link} to={path}>
              <UnstyledButton
                sx={(theme) => ({
                  display: 'block',
                  width: '100%',
                  padding: theme.spacing.xs,
                  borderRadius: theme.radius.sm,
                  color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

                  '&:hover': {
                    backgroundColor:
                      theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                  },
                })}
              >
                <Group>
                  <ThemeIcon color={color} variant="light">
                    {icon}
                  </ThemeIcon>

                  <Text size="sm">{label}</Text>
                </Group>
              </UnstyledButton>
            </Anchor>
          </NavbarMantine.Section>
        ))
      }
    </NavbarMantine>
  );
}

export default Navbar;
