import styled from "@emotion/styled";
import { v4 as uuidv4 } from 'uuid';

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 28px;
`;

interface GridProps<T extends Record<string, unknown>> {
    elements: T[];
    Component: React.FC<T>;
}

//TODO: need to make more generic and reusable
//TODO: add max element to display prop, and show a more button
const Grid = <T extends Record<string, unknown>>({ elements, Component }: GridProps<T>) => {
    return (
        <Container>
            {elements.map((element) => (
                <Component
                    key={uuidv4()}
                    {...element}
                />
            ))}
        </Container>
    );
};

export default Grid;
