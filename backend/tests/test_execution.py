from app.main import app
from fastapi.testclient import TestClient

client = TestClient(app)


def test_execution_sll_insert_front():
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "singly_linked_list",
            "operation": 1,  # INSERT_FRONT
            "current_list": [14, 29, 42],
            "value": 7,
            "position": 0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["schema_version"] == "1.0.0"
    assert data["operation"] == "INSERT_FRONT"
    assert data["final_state"]["nodes"] == [7, 14, 29, 42]
    assert data["validation"]["valid"] is True
    event_types = [e["event_type"] for e in data["events"]]
    assert "ALLOCATE_NODE" in event_types
    assert "SET_NEXT" in event_types
    assert "UPDATE_HEAD" in event_types


def test_execution_sll_delete_back():
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "singly_linked_list",
            "operation": 5,  # DELETE_BACK
            "current_list": [10, 20, 30],
            "value": 0,
            "position": 0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["final_state"]["nodes"] == [10, 20]
    assert data["validation"]["valid"] is True


def test_execution_sll_search():
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "singly_linked_list",
            "operation": 7,  # SEARCH
            "current_list": [10, 25, 50],
            "value": 25,
            "position": 0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operation"] == "SEARCH"
    assert data["events"][-1]["payload"]["found"] is True


def test_execution_sll_reverse():
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "singly_linked_list",
            "operation": 10,  # REVERSE_ITERATIVE
            "current_list": [1, 2, 3],
            "value": 0,
            "position": 0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operation"] == "REVERSE_ITERATIVE"
    assert data["final_state"]["nodes"] == [3, 2, 1]


def test_execution_dll_operations():
    # Insert front in DLL
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "doubly_linked_list",
            "operation": 1,  # INSERT_FRONT
            "current_list": [20, 30],
            "value": 10,
            "position": 0,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operation"] == "INSERT_FRONT"
    assert data["final_state"]["nodes"] == [10, 20, 30]

    # Reverse DLL
    rev_resp = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "doubly_linked_list",
            "operation": 14,  # REVERSE
            "current_list": [10, 20, 30],
        },
    )
    assert rev_resp.status_code == 200
    assert rev_resp.json()["final_state"]["nodes"] == [30, 20, 10]


def test_execution_cll_operations():
    # Insert back in CLL
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "circular_linked_list",
            "operation": 2,  # INSERT_BACK
            "current_list": [10, 20],
            "value": 30,
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["final_state"]["nodes"] == [10, 20, 30]
    assert data["final_state"]["is_circular"] is True

    # Traverse CLL (verifies loop terminates)
    trav_resp = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "circular_linked_list",
            "operation": 8,  # TRAVERSE
            "current_list": [10, 20, 30],
        },
    )
    assert trav_resp.status_code == 200
    assert trav_resp.json()["operation"] == "TRAVERSE"


def test_execution_polynomial():
    # (4x^2 + 3) + (2x^2 + 5x + 1)
    response = client.post(
        "/api/v1/execution/run",
        json={
            "topic": "polynomial",
            "operation": 2,  # ADD
            "coeffs1": [4, 3],
            "exps1": [2, 0],
            "coeffs2": [2, 5, 1],
            "exps2": [2, 1, 0],
        },
    )
    assert response.status_code == 200
    data = response.json()
    assert data["operation"] == "ADD"
    assert "6x^2 + 5x + 4" in data["final_state"]["expression"]


def test_predict_and_debug_checks():
    # SLL predict
    res_pred = client.post(
        "/api/v1/execution/predict/check",
        json={"scenario_id": "pred_insert_front", "selected_option_id": "opt_set_next"},
    )
    assert res_pred.status_code == 200
    assert res_pred.json()["is_correct"] is True

    # DLL predict
    res_dll = client.post(
        "/api/v1/execution/predict/check",
        json={"scenario_id": "pred_dll_insert_front", "selected_option_id": "opt_head_prev"},
    )
    assert res_dll.status_code == 200
    assert res_dll.json()["is_correct"] is True

    # CLL debug
    res_cll = client.post(
        "/api/v1/execution/debug/check",
        json={"challenge_id": "debug_cll_broken_cycle", "action": "close_circle"},
    )
    assert res_cll.status_code == 200
    assert res_cll.json()["resolved"] is True
