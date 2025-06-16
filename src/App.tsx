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
import { useState } from "react";

function App() {
  const tools = [
    {
      id: "kenney-assets",
      title: "Kenney's Game Assets",
      description: "A collection of free game assets.",
      url: "https://www.kenney.nl/",
      image:
        "https://64.media.tumblr.com/03412bbed4b2093cd5b8410ffca141ad/tumblr_ovqahxG3aO1th5bfvo1_1280.png",
      tags: ["gamedev", "free"],
    },
    {
      id: "mantine",
      title: "Mantine",
      description: "A React UI component library with many items.",
      url: "https://mantine.dev/",
      image:
        "https://miro.medium.com/v2/resize:fit:1400/1*faSvT2rE67paB7VALQLvyA.png",
      tags: ["react", "ui", "free", "OSS"],
    },
    {
      id: "aseprite",
      title: "Aseprite",
      description: "A pixel art tool for creating 2D animations and sprites.",
      url: "https://www.aseprite.org/",
      image:
        "https://shared.fastly.steamstatic.com/store_item_assets/steam/apps/431730/capsule_616x353.jpg?t=1749680273",
      tags: ["art", "gamedev", "paid", "OSS"],
    },
    {
      id: "visual-studio-code",
      title: "Visual Studio Code",
      description: "A powerful code editor with support for many languages.",
      url: "https://code.visualstudio.com/",
      image:
        "https://learn.microsoft.com/en-us/shows/visual-studio-code/media/visual-studio-code-banner-image.jpg",
      tags: ["IDE", "free"],
    },
    {
      id: "unity",
      title: "Unity",
      description: "A cross-platform game engine for creating 2D and 3D games.",
      url: "https://unity.com/",
      image:
        "https://dotnet.microsoft.com/blob-assets/images/illustrations/unity/unity-engine-landscape-swimlane.png",
      tags: ["gamedev", "free tier"],
    },
    {
      id: "blender",
      title: "Blender",
      description: "An open-source 3D creation suite.",
      url: "https://www.blender.org/",
      image: "https://i.ebayimg.com/images/g/L4EAAOSwT-VnXWaP/s-l1200.jpg",
      tags: ["art", "gamedev", "free", "OSS"],
    },
  ];

  const [pinned, setPinned] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

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
    return (
      <Card>
        <Card.Section>
          <img
            src={tool.image}
            alt={tool.title}
            style={{ width: "100%", aspectRatio: "16/9 !important" }}
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
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            height: "60px",
          }}
        >
          {tool.description}
        </Text>
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
