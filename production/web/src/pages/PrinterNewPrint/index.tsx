import { useEffect, useState } from "react";
import { Title, Divider, Group, Container, Select, Button, Text } from "@mantine/core";
import { useForm } from '@mantine/form';
import { Dropzone } from '@mantine/dropzone';

export const PrinterNewPrintPage = () => {
  const [error, setError] = useState('');
  const [created, setCreated] = useState(false);
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState([]);
  
  const form = useForm({
    initialValues: {
      id: '',
      file: undefined
    } as { id: string; file?: File },
  });

  const handleNewPrinter = async (values: any) => {
    setDisabled(true);

    const printForm = new FormData();
    printForm.append('file', values.file);

    const response = await fetch(`/api/printer/${values.id}`, {
      method: 'POST',
      body: printForm
    });

    console.log(response);

    if (response.status < 300) {
      setCreated(true);
      setDisabled(false);
    } else {
      setDisabled(false);
      setError('Nie udało się dodać druku');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/printer');
      const data = await response.json();

      if (data.printers) {
        const newData = data.printers.map((p: any) => ({
          value: p.id,
          label: p.name,
        }));

        setData(newData);
      } else {
        setError('Nie udało się pobrać listy drukarek');
      }
    };

    fetchData();
  }, []);

  const dropzoneChildren = () => (
    <Group position="center" spacing="xl" style={{ minHeight: 220, pointerEvents: 'none' }}>
      <div>
        {
          form.values.file ? (
            <Text size="xl" inline>
              Załadowany plik: {form.values.file.name}
            </Text>
          ) : (
            <Text size="xl" inline>
              Przeciągnij tutaj i upuść plik GCODE lub kliknij aby wybrać plik
            </Text>
          )
        }
      </div>
    </Group>
  );

  return (
    <div>
      <Container>
      <Title order={2}>Dodaj druk</Title>
      <Divider size="sm" my='lg' />
      {
        created ? (
          <Group position="right" my={50}>
            <Button variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} onClick={() => {
              setDisabled(false);
              setCreated(false);
              form.reset();
            }}>
              Dodaj kolejny druk
            </Button>
          </Group>
        )
        : (
          <form onSubmit={form.onSubmit(handleNewPrinter)}>

              <Group direction="column" spacing='lg' grow>
                <Select
                  disabled={disabled}
                  required
                  label="Wybierz drukarke"
                  data={data}
                  {...form.getInputProps('id')}
                />

              <Dropzone
                accept={['text/x.gcode']}
                multiple={false}
                onDrop={(files) => form.setFieldValue('file', files.pop())}
              >
                {() => dropzoneChildren()}
              </Dropzone>
        
              </Group>
              {error && (
                  <Group position="right" my={10}>
                    <Text color="red">{error}</Text>
                  </Group>
                )
              }
              <Group position="right" my={50}>
                <Button disabled={disabled} variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} type="submit">
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