const { useState, useEffect } = React

export function BugFilter({ filterBy, onSetFilterBy,allBugs }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break

            case 'checkbox':
                value = target.checked
                break

            default:
                break
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
    }

    function onGetPage(dir) {
        setFilterByToEdit(prev => {
            if (prev.pageIdx + dir < 0) return prev
            if(prev.pageIdx + dir >= allBugs.length - 1) return prev
            return { ...prev, pageIdx: prev.pageIdx += dir }
        })
    }

    function togglePagination() {
        setFilterByToEdit(prev => {
            const paginationOn = !prev.paginationOn
            return { ...prev, paginationOn }
        })
    }

    function resetSort() {
        setFilterByToEdit(prev => ({ ...prev, sortField: '', sortDir: 1 }))
    }
    
    const { txt, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Filter</h2>
            <section className="pagination">
                <button disabled={!filterBy.paginationOn} onClick={() => onGetPage(-1)}>-</button>
                <span>{filterBy.pageIdx+1}</span>
                <button disabled={!filterBy.paginationOn} onClick={() => onGetPage(1)}>+</button>
                <button onClick={togglePagination}>Toggle Pagination</button>
            </section>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="txt">Text: </label>
                <input value={txt} onChange={handleChange} type="text" placeholder="By Text" id="txt" name="txt" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />
            </form>
            <div className="sort-by">
                <div className="sort-field">
                    <label className="tag" >
                        <span>Title</span>
                        <input
                            type="radio"
                            name="sortField"
                            value="title"
                            checked={filterByToEdit.sortField === 'title'}
                            onChange={handleChange}
                        />
                    </label>
                    <label className="tag" >
                        <span>Severity</span>
                        <input
                            type="radio"
                            name="sortField"
                            value="severity"
                            checked={filterByToEdit.sortField === 'severity'}            
                            onChange={handleChange}
                        />
                    </label>
                    <label className="tag" >
                        <span>Created At</span>
                        <input
                            type="radio"
                            name="sortField"
                            value="createdAt"
                            checked={filterByToEdit.sortField === 'createdAt'}                        
                            onChange={handleChange}
                        />
                    </label>
                </div>

                <div className="sort-dir">
                    <label className="tag" >
                        <span>Asce</span>
                        <input
                            type="radio"
                            name="sortDir"
                            value="1"
                            checked={filterByToEdit.sortDir === "1"}                        
                            onChange={handleChange}
                        />
                    </label>
                    <label className="tag" >
                        <span>Desc</span>
                        <input
                            type="radio"
                            name="sortDir"
                            value="-1"
                            onChange={handleChange}
                            checked={filterByToEdit.sortDir === "-1"}                        
                        />
                    </label>
                </div>

                <button onClick={resetSort}>Clear Sort</button>
            </div>
        </section>
    )
}