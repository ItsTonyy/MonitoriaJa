# Estilização do botão
- Botão de confirmação
estilo: <Button variant="contained" color="a definir" size="medium">Contained</Button>


- Botão de cancelamento
estilo: <Button variant="contained" color="a definir" size="medium">Contained</Button>

# Estilização do input text
estilo: <TextField id="outlined-basic" label="Outlined" variant="outlined" />
se for um atributo obrigatório adicionar "required".
se for um campo de senha, adicionar type="password"

# campo de texto:
<TextField
  id="outlined-multiline-static"
  label="Multiline"
  multiline
  rows={4} 
  defaultValue="Default Value"
/>

rows = colocar tamanho adequado, não necessariamente precisa ser 4

em casos de select:
- adicionar array de objetos
- adicionar um map do array criado dentro do textsize

exemplo:

const currencies = [
  {
    value: 'USD',
    label: '$',
  },
  {
    value: 'EUR',
    label: '€',
  },
];

e ai dentro do select terá um:

<TextField
  id="outlined-select-currency"
  select
  label="Select"
  defaultValue="EUR"
  helperText="Please select your currency"
>
  {currencies.map((option) => (
  <MenuItem key={option.value} value={option.value}>
    {option.label}
  </MenuItem>
  ))}
</TextField>

# breakpoints
celular:
sm	40rem (640px)	@media (width >= 40rem) { ... }


lg	64rem (1024px)	@media (width >= 64rem) { ... }


xl	80rem (1280px)	@media (width >= 80rem) { ... }

# Fonte
Roboto (por enquanto)
https://fonts.google.com/specimen/Roboto