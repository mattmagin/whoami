require "rails_helper"
require "reading_time"

RSpec.describe ReadingTime do
  describe ".calculate" do
    it "returns 1 for nil content" do
      expect(described_class.calculate(nil)).to eq(1)
    end

    it "returns 1 for empty string" do
      expect(described_class.calculate("")).to eq(1)
      expect(described_class.calculate("   ")).to eq(1)
    end

    it "returns 1 for content shorter than 1 minute" do
      expect(described_class.calculate("Hello world")).to eq(1)
    end

    it "returns correct minutes for longer content" do
      # 200 words = 1 minute at default 200 wpm
      content_200_words = (["word"] * 200).join(" ")
      expect(described_class.calculate(content_200_words)).to eq(1)

      # 201 words = 2 minutes (ceiling)
      content_201_words = (["word"] * 201).join(" ")
      expect(described_class.calculate(content_201_words)).to eq(2)

      # 400 words = 2 minutes
      content_400_words = (["word"] * 400).join(" ")
      expect(described_class.calculate(content_400_words)).to eq(2)
    end

    it "respects custom words per minute" do
      content_100_words = (["word"] * 100).join(" ")

      # At 100 wpm, 100 words = 1 minute
      expect(described_class.calculate(content_100_words, 100)).to eq(1)

      # At 50 wpm, 100 words = 2 minutes
      expect(described_class.calculate(content_100_words, 50)).to eq(2)
    end
  end

  describe ".format" do
    it "returns human-readable string for short content" do
      expect(described_class.format("Hello world")).to eq("1 minute read")
    end

    it "returns pluralized string for longer content" do
      content_500_words = (["word"] * 500).join(" ")
      expect(described_class.format(content_500_words)).to eq("3 minutes read")
    end

    it "handles nil content" do
      expect(described_class.format(nil)).to eq("1 minute read")
    end
  end
end
