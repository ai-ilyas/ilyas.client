import React, {
  useState
} from 'react';
import {
  Tag,
  TagInput
} from 'emblor';

export default function Tager() {

  const tags = [
    {
      "id": "1988123233",
      "text": "Gold"
  },
    {
      "id": "3731979803",
      "text": "Realtime"
  },
    {
      "id": "2478369078",
      "text": "Cloud"
  }
];
  const [exampleTags, setExampleTags] = useState < Tag[] > (tags);
  const [activeTagIndex, setActiveTagIndex] = useState < number | null > (null);

  return ( <
    TagInput tags = {
      exampleTags
    }
    setTags = {
      (newTags) => {
        setExampleTags(newTags);
      }
    }
    placeholder = ""
    className = "sm:max-w-[350px]"
    activeTagIndex = {
      activeTagIndex
    }
    setActiveTagIndex = {
      setActiveTagIndex
    }
    shape = {
      "pill"
    }
    size = {
      "sm"
    }
    textCase = {
      "capitalize"
    }
    textStyle = {
      "bold"
    }
    />
  );
};
