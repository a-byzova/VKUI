Компонент-обертка над [Spinner](#!/Spinner).

Передаётся в качестве значения свойства `popout` компонента [`SplitLayout`](https://vkcom.github.io/VKUI/#/SplitLayout).

Рекомендуется использовать в случаях, когда требуется заблокировать интерфейс до завершения асинхронного процесса.

```jsx { "props": { "layout": false, "adaptivity": true } }
const [popout, setPopout] = useState(null);

const clearPopout = () => setPopout(null);

const setLoadingScreenSpinner = () => {
  setPopout(<ScreenSpinner state="loading" />);
  setTimeout(clearPopout, 3000);
};

const setDoneScreenSpinner = () => {
  setPopout(<ScreenSpinner state="loading" />);

  setTimeout(() => {
    setPopout(<ScreenSpinner state="done" aria-label="Успешно" />);

    setTimeout(clearPopout, 1000);
  }, 2000);
};

const setErrorScreenSpinner = () => {
  setPopout(<ScreenSpinner state="loading" />);

  setTimeout(() => {
    setPopout(<ScreenSpinner state="error" aria-label="Произошла ошибка" />);

    setTimeout(clearPopout, 1000);
  }, 2000);
};

const setCancelableScreenSpinner = () => {
  setPopout(<ScreenSpinner state="cancelable" onClick={clearPopout} />);
};

<SplitLayout popout={popout}>
  <SplitCol>
    <View activePanel="spinner">
      <Panel id="spinner">
        <PanelHeader>ScreenSpinner</PanelHeader>
        <Group>
          <CellButton onClick={setLoadingScreenSpinner}>
            Запустить долгий процесс
          </CellButton>
          <CellButton onClick={setDoneScreenSpinner}>
            Запустить успешный процесс
          </CellButton>
          <CellButton onClick={setErrorScreenSpinner}>
            Запустить процесс с ошибкой
          </CellButton>
          <CellButton onClick={setCancelableScreenSpinner}>
            Запустить отменяемый процесс
          </CellButton>
        </Group>
      </Panel>
    </View>
  </SplitCol>
</SplitLayout>;
```
