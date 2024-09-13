String.prototype.toCamelCase = function() {
    return this.split(/[-\/]/)
        .map((word: string) => {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join(' ');
};