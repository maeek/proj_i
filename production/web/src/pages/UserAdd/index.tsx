import { Title, Divider, Group, TextInput, Container, Select, Button, Text } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useState } from "react";

export const UserAddPage = () => {
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const form = useForm({
    initialValues: {
      username: '',
      password: '',
      role: 'user',
    },
    validate: {
      username: (value) => (value.length > 0 && !['admin', 'root'].includes(value)) ? null : 'Nieprawodłowy login',
    },
  });

  const handleNewUser = async (values: any) => {
    setDisabled(true);

    const response = await fetch('/api/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.username,
        password: values.password,
        role: values.role,
      })
    });
    const data = await response.json();

    if (data.id) {
      setCreated(true);
      setDisabled(false);
    } else {
      setDisabled(false);
      setError('Nie udało się dodać użytkownika');
    }
  };

  return (
    <div>
      <Container>
      <Title order={2}>Dodaj użytkownika</Title>
      <Divider size="sm" my='lg' />
      {
        created ? (
          <Group position="right" my={50}>
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={() => {
              setDisabled(false);
              setCreated(false);
              form.reset();
            }}>
              Stwórz kolejnego użytkownika
            </Button>
          </Group>
        )
        : (
          <form onSubmit={form.onSubmit(handleNewUser)}>

              <Group direction="column" spacing='lg' grow>
                <TextInput
                  disabled={disabled}
                  label="Nazwa użytkownika"
                  required
                  placeholder="pracownik33"
                  {...form.getInputProps('username')}
                />

                <TextInput
                  disabled={disabled}
                  label="Hasło"
                  description="Użytkownik będzie musiał zmienić hasło przy pierwszym logowaniu"
                  required
                  placeholder="Hasło do systemu"
                  type="password"
                  {...form.getInputProps('password')}
                />

                <Select
                  disabled={disabled}
                  label="Wybierz rolę użytkownika w systemie"
                  placeholder="użytkownik"
                  data={[
                    { value: 'user', label: 'Użytkownik' },
                    { value: 'admin', label: 'Administrator' },
                  ]}
                  {...form.getInputProps('role')}
                />
        
              </Group>
              {error && (
                  <Group position="right" my={10}>
                    <Text color="red">{error}</Text>
                  </Group>
                )
              }
              <Group position="right" my={50}>
                <Button disabled={disabled} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} type="submit">
                  Stwórz
                </Button>
              </Group>
          </form>
        )
      }
      </Container>
    </div>
  );
}