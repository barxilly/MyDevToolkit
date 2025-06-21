import "@mantine/core/styles.css";
import "./App.css";
import {
  Badge,
  Button,
  Card,
  Flex,
  Grid,
  Group,
  MantineProvider,
  Space,
  Text,
  Title,
} from "@mantine/core";
import { TiPin, TiPinOutline } from "react-icons/ti";
import { useState, useMemo } from "react";
import toolsData from "./tools.json";

function App() {
  const tools = useMemo(() => toolsData, []);

  const [pinned, setPinned] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedDesc, setExpandedDesc] = useState<string | null>(null);

  let allTags = Array.from(new Set(tools.flatMap((tool) => tool.tags)));

  allTags = allTags.sort((a, b) => {
    if (a === "free") return -1;
    if (b === "free") return 1;
    if (a === "paid") return -1;
    if (b === "paid") return 1;
    if (a === "free tier") return -1;
    if (b === "free tier") return 1;
    return a.localeCompare(b);
  });

  const togglePin = (id: string) => {
    setPinned((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredTools = selectedTags.length > 0
    ? tools.filter((tool) => selectedTags.some((tag) => tool.tags.includes(tag)))
    : tools;

  function ToolCard({
    tool,
    pinned,
    onPinToggle,
    onGo,
    showTags,
  }: {
    tool: (typeof tools)[number];
    pinned: boolean;
    onPinToggle: () => void;
    onGo: () => void;
    showTags?: boolean;
  }) {
    const isExpanded = expandedDesc === tool.id;
    const truncated = tool.description.length > 27 && !isExpanded;
    return (
      <Card>
        <Card.Section>
          <img
            src={tool.image}
            alt={tool.title}
            style={{ width: "100%", height:"10em", aspectRatio: "16/9 !important" }}
          />
        </Card.Section>
        <Space h="sm" />
        <Title order={4}>{tool.title}</Title>
        {showTags && (
          <Group gap={4} mb={4}>
            {tool.tags.map((tag) => (
              <Badge key={tag} size="xs" color="gray">
                {tag}
              </Badge>
            ))}
          </Group>
        )}
        <Text
          style={
            truncated
              ? {
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 1,
                  WebkitBoxOrient: "vertical",
                  cursor: "pointer",
                  height: "24px",
                }
              : { cursor: "pointer" }
          }
          onClick={() =>
            setExpandedDesc(isExpanded ? null : tool.id)
          }
          title={truncated ? tool.description : undefined}
        >
          {truncated
            ? tool.description.slice(0, 27) + "..."
            : tool.description}
        </Text>
        {tool.description.length > 27 && (
          <Text
            size="xs"
            color="blue"
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => setExpandedDesc(isExpanded ? null : tool.id)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </Text>
        )}
        <Space h="sm" />
        <Flex>
          <Button onClick={onGo} w="100%">
            Go
          </Button>
          <Button
            style={{ marginLeft: "8px" }}
            color={pinned ? "yellow" : undefined}
            onClick={onPinToggle}
          >
            {pinned ? <TiPin size="sm" /> : <TiPinOutline size="sm" />}
          </Button>
        </Flex>
      </Card>
    );
  }

  return (
    <MantineProvider>
      <Title
        order={1}
        style={{ textAlign: "center", marginTop: "20px", fontSize: "3rem" }}
      >
        MyDevToolkit
      </Title>
      <Space h="xl" />
      <Title order={3}>My Pins</Title>
      <Space h="md" />
      {pinned.length === 0 ? (
        <div
          style={{
            border: "4px dashed #888",
            borderRadius: "16px",
            width: "100%",
            height: "120px",
          }}
        >
          <Text
            style={{
              textAlign: "center",
              paddingTop: "40px",
              fontSize: "1.5rem",
              color: "#888",
            }}
          >
            Nothing here :p
          </Text>
        </div>
      ) : (
        <Grid>
          {tools
            .filter((tool) => pinned.includes(tool.id))
            .map((tool) => (
              <Grid.Col span={4} key={tool.id}>
                <ToolCard
                  tool={tool}
                  pinned={true}
                  onPinToggle={() => togglePin(tool.id)}
                  onGo={() => window.open(tool.url, "_blank")}
                  showTags={false}
                />
              </Grid.Col>
            ))}
        </Grid>
      )}
      <Space h="xl" />
      <Title order={3}>Tools</Title>
      <Space h="md" />
      <Group mb="md">
        <Badge
          variant={selectedTags.length === 0 ? "filled" : "outline"}
          onClick={() => setSelectedTags([])}
          style={{ cursor: "pointer" }}
        >
          All
        </Badge>
        {allTags.map((tag) => (
          <Badge
            key={tag}
            color={selectedTags.includes(tag) ? "blue" : undefined}
            variant={selectedTags.includes(tag) ? "filled" : "outline"}
            onClick={() => toggleTag(tag)}
            style={{ cursor: "pointer" }}
          >
            {tag}
          </Badge>
        ))}
      </Group>
      <Grid>
        {filteredTools.map((tool) => (
          <Grid.Col span={4} key={tool.id}>
            <ToolCard
              tool={tool}
              pinned={pinned.includes(tool.id)}
              onPinToggle={() => togglePin(tool.id)}
              onGo={() => window.open(tool.url, "_blank")}
              showTags={true}
            />
          </Grid.Col>
        ))}
      </Grid>
    </MantineProvider>
  );
}

export default App;
