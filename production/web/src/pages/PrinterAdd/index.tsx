import { Title, Divider, Group, TextInput, Container, Select, Button, Text } from "@mantine/core";
import { useForm } from '@mantine/form';
import { useState } from "react";
import { fetchHelper } from "../../utils/fetch";

export const PrinterAddPage = () => {
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const form = useForm({
    initialValues: {
      name: '',
      ip: '',
      port: 80,
      proto: 'http',
      type: 'octopi',
      apiKey: ''
    },
    validate: {
      port: (value) => typeof value === 'number' ? null : 'Port powinien być typu numerycznego',
      proto: (value) => ['http', 'https'].includes(value) ? null : 'Obsugiwane są tylko protokol HTTP i HTTPS',
    },
  });

  const handleNewPrinter = async (values: any) => {
    setDisabled(true);

    const response = await fetchHelper('/api/printer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values)
    });
    const data = await response.json();

    if (data.id) {
      setCreated(true);
      setDisabled(false);
    } else {
      setDisabled(false);
      setError('Nie udało się dodać drukarki');
    }
  };

  return (
    <div>
      <Container>
      <Title order={2}>Dodaj drukarkę</Title>
      <Divider size="sm" my='lg' />
      {
        created ? (
          <Group position="right" my={50}>
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={() => {
              setDisabled(false);
              setCreated(false);
              form.reset();
            }}>
              Dodaj kolejną drukarkę
            </Button>
          </Group>
        )
        : (
          <form onSubmit={form.onSubmit(handleNewPrinter)}>

              <Group direction="column" spacing='lg' grow>
                <TextInput
                  disabled={disabled}
                  label="Nazwa drukarki"
                  required
                  placeholder="Drukarka 1"
                  name="printer-name"
                  {...form.getInputProps('name')}
                />

                <TextInput
                  disabled={disabled}
                  label="Adres drukarki"
                  required
                  placeholder="x.x.x.x"
                  name="printer-ip"
                  {...form.getInputProps('ip')}
                />

                <TextInput
                  disabled={disabled}
                  label="Port drukarki"
                  required
                  placeholder="80"
                  name="printer-port"
                  {...form.getInputProps('port')}
                />

                <Select
                  disabled={disabled}
                  required
                  label="Wybierz protokół komunikacji z drukarką"
                  data={[
                    { value: 'http', label: 'http://' },
                    { value: 'https', label: 'https://' },
                  ]}
                  name="printer-proto"
                  {...form.getInputProps('proto')}
                />

                <Select
                  disabled={disabled}
                  required
                  label="Wybierz typ drukarki"
                  placeholder="OctoPrint"
                  data={[
                    { value: 'octopi', label: 'OctoPrint' },
                  ]}
                  {...form.getInputProps('type')}
                />

                <TextInput
                  disabled={disabled}
                  required
                  label="Klucz API"
                  placeholder="XXXXXXXXXXXXXXXXXXXXX"
                  name="printer-apikey"
                  {...form.getInputProps('apiKey')}
                />
        
              </Group>
              {error && (
                  <Group position="right" my={10}>
                    <Text color="red">{error}</Text>
                  </Group>
                )
              }
              <Group position="right" my={50}>
                <Button
                  disabled={disabled}
                  variant="gradient"
                  gradient={{ from: 'indigo', to: 'cyan' }}
                  type="submit"
                  name="printer-submit"
                >
                  Dodaj
                </Button>
              </Group>
          </form>
        )
      }
      </Container>
    </div>
  );
}