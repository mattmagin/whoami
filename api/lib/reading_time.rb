module ReadingTime
    DEFAULT_WORDS_PER_MINUTE = 200

    def self.calculate(content, words_per_minute = DEFAULT_WORDS_PER_MINUTE)
        return 1 if content.nil? || content.strip.empty?

        words = content.split.size
        [(words / words_per_minute.to_f).ceil, 1].max
    end

    def self.format(content, words_per_minute = DEFAULT_WORDS_PER_MINUTE)
        minutes = calculate(content, words_per_minute)
        "#{minutes} #{'minute'.pluralize(minutes)} read"
    end
end